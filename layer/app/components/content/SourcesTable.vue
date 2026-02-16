<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getGroupedRowModel } from '@tanstack/vue-table'

const { globalFilter, tableData, grouping, expanded, affiliationColor, getLinkInfo } = useSourcesTable()

const columns: TableColumn<Record<string, unknown>>[] = [
  {
    accessorKey: 'categoryLabel',
    header: 'Category',
    enableHiding: true,
  },
  {
    accessorKey: 'title',
    header: 'Document',
    size: 400,
    minSize: 300,
    meta: {
      class: {
        td: 'max-w-[500px] align-top whitespace-normal',
        th: 'max-w-[500px]',
      },
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 300,
    minSize: 200,
    meta: {
      class: {
        td: 'max-w-[300px] align-top whitespace-normal text-pretty',
        th: 'max-w-[300px]',
      },
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    size: 100,
    minSize: 80,
    maxSize: 100,
    meta: {
      class: {
        td: 'max-w-[100px] align-top',
        th: 'max-w-[100px]',
      },
    },
  },
]
</script>

<template>
  <div class="space-y-6 w-full">
    <!-- Global Search -->
    <div class="flex flex-col sm:flex-row gap-4">
      <UInput
        v-model="globalFilter"
        placeholder="Search sources..."
        icon="i-lucide-search"
        class="flex-1"
      />
    </div>

    <!-- Single Unified Table with Grouping -->
    <div class="overflow-x-auto">
      <UTable
        v-model:global-filter="globalFilter"
        v-model:expanded="expanded"
        :data="tableData"
        :columns="columns"
        :grouping="grouping"
        :grouping-options="{
          getGroupedRowModel: getGroupedRowModel(),
          groupedColumnMode: 'remove',
        }"
        :ui="{
          root: 'border border-default rounded-lg',
          base: 'min-w-full',
          td: 'p-4 text-sm text-muted whitespace-nowrap empty:p-0',
        }"
      >
        <!-- Document Cell (Title + Author + Type + Links) -->
        <template #title-cell="{ row }">
          <!-- Group Row -->
          <div
            v-if="row.getIsGrouped()"
            class="flex items-center gap-2 py-1 cursor-pointer select-none"
            @click="row.toggleExpanded()"
          >
            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              :icon="
                row.getIsExpanded()
                  ? 'i-lucide-chevron-down'
                  : 'i-lucide-chevron-right'
              "
              class="-ml-2 pointer-events-none"
            />
            <span
              class="text-lg font-bold text-highlighted uppercase tracking-wide"
            >
              {{ row.getValue('categoryLabel') }}
            </span>
            <span class="text-xs text-muted font-normal ml-2">({{ row.subRows.length }})</span>
          </div>

          <!-- Normal Source Row -->
          <div
            v-else
            class="space-y-3 whitespace-normal"
          >
            <div class="font-semibold text-base text-highlighted text-pretty">
              {{ row.original.title }}
            </div>

            <div class="flex flex-wrap items-center gap-2 text-sm">
              <span
                v-if="row.original.author"
                class="text-muted"
              >
                {{ row.original.author }}
              </span>

              <UBadge
                v-if="row.original.affiliation"
                :label="String(row.original.affiliation)"
                :color="affiliationColor[String(row.original.affiliation)] ?? 'neutral'"
                variant="soft"
                size="xs"
                class="capitalize"
              />
            </div>

            <div class="flex items-center gap-2 pt-1">
              <template v-if="getLinkInfo(row.original)">
                <UButton
                  :to="getLinkInfo(row.original)!.primary"
                  :icon="getLinkInfo(row.original)!.primaryIcon"
                  :label="getLinkInfo(row.original)!.primaryLabel"
                  size="xs"
                  variant="soft"
                  color="primary"
                  target="_blank"
                />

                <UButton
                  v-if="getLinkInfo(row.original)!.secondary"
                  :to="getLinkInfo(row.original)!.secondary"
                  :icon="getLinkInfo(row.original)!.secondaryIcon"
                  :label="getLinkInfo(row.original)!.secondaryLabel"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  target="_blank"
                />
              </template>
            </div>
          </div>
        </template>

        <!-- Description Cell -->
        <template #description-cell="{ row }">
          <div
            v-if="!row.getIsGrouped() && row.original.description"
            class="text-sm text-muted leading-relaxed text-pretty"
          >
            {{ row.original.description }}
          </div>
        </template>

        <!-- Date Cell -->
        <template #date-cell="{ row }">
          <div v-if="!row.getIsGrouped()">
            <span class="text-sm text-muted">{{ row.original.date }}</span>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>
