<template>
  <div class="rounded-xl border bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
        <p class="mt-2 text-3xl font-bold text-foreground">{{ value }}</p>
        <p class="mt-1 text-xs text-muted-foreground">{{ description }}</p>
      </div>
      <div 
        class="flex h-12 w-12 items-center justify-center rounded-lg"
        :class="colorClasses"
      >
        <component :is="iconComponent" class="h-6 w-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UserCog, CheckCircle, Clock, Users } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  value: number
  description: string
  icon: string
  color: 'blue' | 'green' | 'amber' | 'purple'
}>()

const colorClasses = computed(() => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600'
  }
  return colors[props.color]
})

const iconComponent = computed(() => {
  const icons: Record<string, any> = {
    UserCog,
    CheckCircle,
    Clock,
    Users
  }
  return icons[props.icon] || UserCog
})
</script>