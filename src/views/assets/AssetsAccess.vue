<template>
  <div class="space-y-6">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- ✅ PHASE 3: Consultant Filter Combobox -->
      <div class="relative min-w-[260px] flex-1" @click.stop>
        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="consultantComboOpen"
          class="h-[46px] w-full rounded-[10px] border border-[#d5dee8] bg-white pl-4 pr-10 text-sm text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-[#8a97a8] hover:border-[#b9c8d8] focus:border-[#122033] focus:outline-none focus:ring-[3px] focus:ring-[rgba(14,116,144,.25)]"
          :value="consultantComboText"
          placeholder="All consultants (full catalog)"
          @focus="onConsultantComboFocus"
          @input="onConsultantComboInput($event)"
          @blur="onConsultantComboBlur"
          @keydown.down.prevent="onConsultantComboFocus"
          @keydown.esc.prevent="onConsultantComboEscape"
          @keydown.enter.prevent="onConsultantComboEnter"
        />
        <button
          type="button"
          tabindex="-1"
          aria-label="Toggle consultant options"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink"
          @mousedown.prevent
          @click="onConsultantComboToggle"
        >
          <ChevronDown class="h-4 w-4 transition-transform duration-200" :class="consultantComboOpen ? 'rotate-180' : ''" />
        </button>
        <div
          v-show="consultantComboOpen"
          class="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-[10px] border border-line bg-white p-1 shadow-xl"
          role="listbox"
        >
          <div
            v-for="opt in filteredConsultantOptions"
            :key="opt.id"
            class="cursor-pointer rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-[#f2f6fa] focus:bg-[#e9eef5] focus:outline-none"
            role="option"
            tabindex="0"
            :aria-selected="consultantId === opt.id"
            @mousedown.prevent
            @click="selectConsultantCombo(opt)"
            @keydown.enter.prevent="selectConsultantCombo(opt)"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="flex-1" :class="consultantId === opt.id ? 'font-semibold text-ink' : 'text-ink-2'">{{ opt.name }}</span>
              <Check v-if="consultantId === opt.id" class="h-4 w-4 flex-shrink-0 text-brand" />
            </div>
          </div>
          <div v-if="!filteredConsultantOptions.length" class="px-4 py-3 text-[13px] text-ink-3">No matching consultants.</div>
        </div>
      </div>

      <button type="button" class="inline-flex items-center gap-2 rounded-[10px] border border-[#12607A] bg-[#12607A] px-[18px] py-[11px] text-sm font-semibold text-white transition-colors hover:border-[#198754] hover:bg-[#198754]" @click="openAddAsset">
        Add Asset <AppIcon name="i-plus" class="h-4 w-4" />
      </button>
      <button type="button" class="inline-flex items-center gap-2 rounded-[10px] border border-[#12607A] bg-[#12607A] px-[18px] py-[11px] text-sm font-semibold text-white transition-colors hover:border-[#198754] hover:bg-[#198754]" @click="openAddAccount">
        Add System Account <AppIcon name="i-plus" class="h-4 w-4" />
      </button>
    </div>

    <!-- ===== Asset catalog & assignments ===== -->
    <div>
      <div class="flex items-center justify-start gap-4 px-6 py-4">
        <h2 class="text-[15px] font-semibold text-ink">Asset Catalog & Assignments</h2>
        <span class="text-[12px] text-ink-3">{{ filteredAssets.length }} items</span>
      </div>
      <div class="overflow-x-auto rounded-[24px] border border-line bg-white shadow-sm">
        <table class="w-full table-fixed text-left text-sm">
          <thead class="border-b border-line bg-[#f7fafc] text-ink">
            <tr>
              <th class="h-16 w-[18%] px-6 text-left align-middle font-semibold">Asset Tag</th>
              <th class="h-16 w-[15%] px-6 text-left align-middle font-semibold">Category</th>
              <th class="h-16 w-[22%] px-6 text-left align-middle font-semibold">Model / Serial</th>
              <th class="h-16 w-[12%] px-6 text-left align-middle font-semibold">Status</th>
              <th class="h-16 w-[18%] px-6 text-left align-middle font-semibold">Assigned To</th>
              <th class="h-16 w-[15%] px-6 text-left align-middle font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-if="filteredAssets.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-ink-3">No assets in the catalog yet. Use "Add Asset".</td>
            </tr>
            <tr v-for="a in filteredAssets" :key="a.id" class="transition-colors hover:bg-[#d7e0ea]/40">
              <td class="px-6 py-4 font-semibold text-ink">{{ a.asset_tag }}</td>
              <td class="px-6 py-4 capitalize text-ink-2">{{ (a.category || '').replace('_', ' ') }}</td>
              <td class="px-6 py-4 text-[13px] text-ink-3">
                {{ a.model || '—' }}<template v-if="a.serial"> · {{ a.serial }}</template>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium" :class="assetPill(a.status)">{{ assetLabel(a.status) }}</span>
              </td>
              <td class="px-6 py-4 text-[13px] text-ink-2">
                {{ consultantName(a.assigned_to) }}
                <span v-if="a.status !== 'assigned' && a.returned_at" class="block text-[11px] text-ink-4">returned {{ formatDate(a.returned_at) }}</span>
              </td>
              <td class="px-6 py-4">
                <button
                  type="button"
                  class="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[#d5dee8] bg-white px-3.5 text-[13px] font-semibold text-ink-2 shadow-sm transition-colors hover:bg-[#f2f6fa]"
                  :aria-expanded="openAssetMenu === a.id"
                  aria-haspopup="menu"
                  @click.stop="toggleAssetMenu(a.id, $event)"
                >
                  Actions
                  <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200" :class="openAssetMenu === a.id ? 'rotate-180' : ''" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== System accounts ===== -->
    <div class="overflow-hidden">
      <!-- ✅ UPDATED: header row with search input beside the title -->
      <div class="flex flex-wrap items-center justify-start gap-4 px-6 py-4">
        <div class="flex items-center gap-4">
          <h2 class="text-[15px] font-semibold text-ink">System Accounts</h2>
          <span class="text-[12px] text-ink-3">{{ searchedAccounts.length }} items</span>
        </div>
        <div class="relative min-w-[240px] flex-1 sm:max-w-[1040px]">
          <AppIcon name="i-search" class="pointer-events-none absolute left-[12px] top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            v-model="accountSearch"
            type="text"
            placeholder="Search system, identifier, or consultant..."
            class="h-[46px] w-full rounded-[10px] border border-[#d5dee8] bg-white pl-[36px] pr-9 text-[13px] text-ink transition-[border-color,box-shadow,background] duration-150 placeholder:text-[#8a97a8] hover:border-[#b9c8d8] focus:border-[#122033] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[rgba(14,116,144,.25)]"
          />
          <button
            v-if="accountSearch"
            type="button"
            aria-label="Clear account search"
            class="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition-colors hover:bg-[#e9eef5] hover:text-ink"
            @click="accountSearch = ''"
          >
            <AppIcon name="i-x" class="h-3 w-3" />
          </button>
        </div>
      </div>
      <div class="overflow-x-auto rounded-[24px] border border-line bg-white shadow-sm">
        <table class="w-full table-fixed text-left text-sm">
          <thead class="border-b border-line bg-[#f7fafc] text-ink">
            <tr>
              <th class="h-16 w-[25%] px-6 text-left align-middle font-semibold">Consultant</th>
              <th class="h-16 w-[25%] px-6 text-left align-middle font-semibold">System</th>
              <th class="h-16 w-[25%] px-6 text-left align-middle font-semibold">Identifier</th>
              <th class="h-16 w-[12%] px-6 text-left align-middle font-semibold">Status</th>
              <th class="h-16 w-[13%] px-6 text-left align-middle font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-if="searchedAccounts.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-ink-3">
                <template v-if="accountSearch">No system accounts match "{{ accountSearch }}".</template>
                <template v-else>No system accounts registered{{ consultantId ? ' for this consultant' : '' }}.</template>
              </td>
            </tr>
            <!-- ✅ UPDATED: iterate the paged slice (max 8 rows) -->
            <tr v-for="s in pagedAccounts" :key="s.id" class="transition-colors hover:bg-[#d7e0ea]/40">
              <td class="px-6 py-4 font-semibold text-ink">{{ consultantName(s.consultant_id) }}</td>
              <td class="px-6 py-4 capitalize text-ink-2">{{ (s.system || '').replace(/_/g, ' ') }}</td>
              <td class="px-6 py-4 text-[13px] text-ink-3">{{ s.identifier || '—' }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium" :class="s.status === 'active' ? 'bg-[#B0761A] text-white' : 'bg-[#e5eaf1] text-[#7b8794]'">{{ s.status === 'active' ? 'Active' : 'Revoked' }}</span>
              </td>
              <td class="px-6 py-4">
                <button
                  type="button"
                  class="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[#d5dee8] bg-white px-3.5 text-[13px] font-semibold text-ink-2 shadow-sm transition-colors hover:bg-[#f2f6fa]"
                  :aria-expanded="openAccountMenu === s.id"
                  aria-haspopup="menu"
                  @click.stop="toggleAccountMenu(s.id, $event)"
                >
                  Actions
                  <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200" :class="openAccountMenu === s.id ? 'rotate-180' : ''" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- ✅ NEW: pagination controls -->
        <div v-if="searchedAccounts.length > 0" class="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3.5">
          <span class="text-[12.5px] text-ink-3">
            Showing {{ accountRangeStart }}–{{ accountRangeEnd }} of {{ searchedAccounts.length }} accounts
          </span>
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              :disabled="accountPage === 1"
              aria-label="Previous page"
              class="grid h-9 w-9 place-items-center rounded-[10px] border border-[#d5dee8] bg-white text-ink-2 transition-colors hover:bg-[#f2f6fa] disabled:cursor-not-allowed disabled:opacity-45"
              @click="goToAccountPage(accountPage - 1)"
            >
              <ChevronDown class="h-4 w-4 rotate-90" />
            </button>
            <template v-for="(p, idx) in accountPageButtons" :key="idx">
              <span v-if="p === '…'" class="px-1 text-[13px] text-ink-4">…</span>
              <button
                v-else
                type="button"
                :aria-current="p === accountPage ? 'page' : undefined"
                class="h-9 min-w-[36px] rounded-[10px] border px-2 text-[13px] font-semibold transition-colors"
                :class="p === accountPage ? 'border-[#12607A] bg-[#12607A] text-white' : 'border-[#d5dee8] bg-white text-ink-2 hover:bg-[#f2f6fa]'"
                @click="goToAccountPage(Number(p))"
              >
                {{ p }}
              </button>
            </template>
            <button
              type="button"
              :disabled="accountPage === accountPageCount"
              aria-label="Next page"
              class="grid h-9 w-9 place-items-center rounded-[10px] border border-[#d5dee8] bg-white text-ink-2 transition-colors hover:bg-[#f2f6fa] disabled:cursor-not-allowed disabled:opacity-45"
              @click="goToAccountPage(accountPage + 1)"
            >
              <ChevronDown class="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Automation panel ===== -->
    <section v-if="consultantId" class="rounded-[24px] border border-line bg-white p-6 shadow-sm">
      <h2 class="text-[15px] font-semibold text-ink">Automation Rules (auto_source)</h2>
      <p class="mt-1 text-[13px] text-ink-3">Tasks on this consultant's active offboarding that are driven by rules. A rule that is already satisfied auto-completes its task on the next asset/account event.</p>
      <ul v-if="autoTasks.length" class="mt-4 flex flex-col gap-2.5">
        <li v-for="t in autoTasks" :key="t.id" class="flex flex-wrap items-center gap-2.5 rounded-[10px] border border-[#e2e8f0] bg-[#fbfdfe] px-4 py-3 text-[13px]">
          <span class="font-semibold text-ink">{{ t.title }}</span>
          <code class="rounded bg-[#eef2f7] px-2 py-0.5 text-[12px] text-[#334155]">{{ t.auto_source }}</code>
          <span class="rounded-pill px-2.5 py-1 text-xs font-medium" :class="t.status === 'completed' ? 'bg-[#177245] text-white' : 'bg-[#B0761A] text-white'">{{ t.status === 'completed' ? 'Completed' : 'Pending' }}</span>
          <span class="ml-auto text-[12px] font-medium" :class="t.satisfied ? 'text-[#177245]' : 'text-[#B0761A]'">
            rule {{ t.satisfied ? 'SATISFIED' : 'not satisfied' }}
          </span>
        </li>
      </ul>
      <p v-else class="mt-4 rounded-[10px] border-[1.5px] border-dashed border-[#d5dee7] px-4 py-[18px] text-[13px] text-ink-3">
        No auto-sourced tasks found. Tag a task in Offboarding Configurations (Automation Rule field) with e.g. <code>assets:returned_all</code> or <code>accounts:revoked_all</code>.
      </p>
    </section>

    <!-- ===== Click-away layer for row menus ===== -->
    <div v-if="openAssetMenu || openAccountMenu" class="fixed inset-0 z-40" @click="closeMenus"></div>

    <!-- ===== Teleported Asset row menu ===== -->
    <Teleport to="body">
      <div
        v-if="openAssetMenu && openAssetRow"
        role="menu"
        class="fixed z-50 w-44 overflow-hidden rounded-[10px] border border-[#d5dee8] bg-white py-1 shadow-lg"
        :style="{ top: `${assetMenuPos.top}px`, left: `${assetMenuPos.left}px` }"
      >
        <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-ink-2 transition-colors hover:bg-[#f2f6fa]" @click="menuEditAsset">
          <AppIcon name="i-edit" class="h-3.5 w-3.5" /> Edit
        </button>
        <button v-if="openAssetRow.status === 'in_stock' || openAssetRow.status === 'maintenance'" type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[#0D5F8F] transition-colors hover:bg-[#f2f6fa]" @click="menuAssignAsset">
          <UserPlus class="h-3.5 w-3.5" /> Assign
        </button>
        <button v-if="openAssetRow.status === 'assigned'" type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[#177245] transition-colors hover:bg-[#f2f6fa]" @click="menuReturnAsset">
          <Undo class="h-3.5 w-3.5" /> Return
        </button>
        <button v-if="openAssetRow.status === 'in_stock' || openAssetRow.status === 'maintenance'" type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[#c14b4b] transition-colors hover:bg-[#f2f6fa]" @click="menuRetireAsset">
          <Archive class="h-3.5 w-3.5" /> Retire
        </button>
      </div>
    </Teleport>

    <!-- ===== Teleported Account row menu (exactly two items) ===== -->
    <Teleport to="body">
      <div
        v-if="openAccountMenu && openAccountRow"
        role="menu"
        class="fixed z-50 w-44 overflow-hidden rounded-[10px] border border-[#d5dee8] bg-white py-1 shadow-lg"
        :style="{ top: `${accountMenuPos.top}px`, left: `${accountMenuPos.left}px` }"
      >
        <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-ink-2 transition-colors hover:bg-[#f2f6fa]" @click="menuEditAccount">
          <AppIcon name="i-edit" class="h-3.5 w-3.5" /> Edit
        </button>
        <button v-if="openAccountRow.status === 'active'" type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[#c14b4b] transition-colors hover:bg-[#f2f6fa]" @click="menuRevoke">
          <UserMinus class="h-3.5 w-3.5" /> Revoke
        </button>
        <button v-else type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[#177245] transition-colors hover:bg-[#f2f6fa]" @click="menuReactivate">
          <Undo class="h-3.5 w-3.5" /> Reactivate
        </button>
      </div>
    </Teleport>

    <!-- ===== Unified Asset Modal (Add / Edit / Assign) ===== -->
    <Teleport to="body">
      <div v-if="assetModalOpen" class="fixed inset-0 z-50 grid place-items-center bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]" @click.self="assetModalOpen = false">
        <div role="dialog" aria-modal="true" class="w-full max-w-[600px] rounded-[24px] border border-line bg-white p-[26px] shadow-lg">
          <h3 class="mb-5 text-[18px] font-medium text-ink">{{ isEditingAsset ? 'Edit Asset' : 'Add Asset' }}</h3>
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Category</span>
              <select v-model="assetForm.category" :class="fieldCls" @change="onCategoryChange">
                <option v-for="o in CATEGORY_OPTIONS" :key="o" :value="o">{{ o.replace('_', ' ') }}</option>
              </select>
            </label>
            <label class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Asset Tag</span>
              <input :value="assetForm.asset_tag" type="text" :class="fieldCls + ' bg-[#f8fafc] text-ink-3 cursor-not-allowed'" disabled />
              <span class="mt-1 block text-[11px] text-ink-4">Auto-generated based on category</span>
            </label>
            <label class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Model</span>
              <input v-model="assetForm.model" :class="fieldCls" placeholder="ThinkPad T14" />
            </label>
            <label class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Serial</span>
              <input v-model="assetForm.serial" :class="fieldCls" placeholder="SN-12345" />
            </label>
            <label class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Status</span>
              <select v-model="assetForm.status" :class="fieldCls">
                <option value="in_stock">In Stock</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </label>
            <label v-if="assetForm.status === 'assigned'" class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Assigned To</span>
              <select v-model="assetForm.assigned_to" :class="fieldCls">
                <option value="" disabled>Select consultant…</option>
                <option v-for="c in consultants" :key="c.id" :value="c.id">{{ c.full_name }}</option>
              </select>
            </label>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink hover:bg-[#f2f6fa]" @click="assetModalOpen = false">Cancel</button>
            <button type="button" class="rounded-[10px] border border-brand bg-brand px-[18px] py-[11px] text-sm font-semibold text-white hover:bg-brand-dk" @click="saveAssetModal">
              {{ isEditingAsset ? 'Save Changes' : 'Add Asset' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== Unified Account Modal (Add / Edit) ===== -->
    <Teleport to="body">
      <div v-if="accountModalOpen" class="fixed inset-0 z-50 grid place-items-center bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]" @click.self="accountModalOpen = false">
        <div role="dialog" aria-modal="true" class="w-full max-w-[560px] rounded-[24px] border border-line bg-white p-[26px] shadow-lg">
          <h3 class="mb-5 text-[18px] font-medium text-ink">{{ isEditingAccount ? 'Edit System Account' : 'Add System Account' }}</h3>
          <div class="grid grid-cols-2 gap-4">
            <!-- Consultant: select on Add, read-only text on Edit -->
            <label class="col-span-2 block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Consultant</span>
              <select v-if="!isEditingAccount" v-model="accountForm.consultant_id" :class="fieldCls">
                <option value="" disabled>Select consultant…</option>
                <option v-for="c in consultants" :key="c.id" :value="c.id">{{ c.full_name }}</option>
              </select>
              <input
                v-else
                type="text"
                :value="consultantName(accountForm.consultant_id)"
                :class="fieldCls + ' bg-[#f8fafc] text-ink-3 cursor-not-allowed'"
                disabled
              />
              <span v-if="isEditingAccount" class="mt-1 block text-[11px] text-ink-4">
                Consultant is the unique owner of this system account and cannot be changed.
              </span>
            </label>
            <label class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">System</span>
              <select v-model="accountForm.system" :class="fieldCls">
                <option v-for="o in SYSTEM_OPTIONS" :key="o" :value="o">{{ o.replace(/_/g, ' ') }}</option>
              </select>
            </label>
            <label class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Status</span>
              <select v-model="accountForm.status" :class="fieldCls" :disabled="!isEditingAccount">
                <option value="active">Active</option>
                <option value="revoked">Revoked</option>
              </select>
              <span v-if="!isEditingAccount" class="mt-1 block text-[11px] text-ink-4">New accounts are always created Active.</span>
            </label>
            <label class="col-span-2 block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Identifier (email / username)</span>
              <input v-model="accountForm.identifier" :class="fieldCls" placeholder="name@geco.asia" />
            </label>
          </div>
          <p v-if="isEditingAccount && accountForm.status === 'revoked'" class="mt-4 rounded-[10px] border border-[#e4b4b4] bg-[#FDF5F6] px-4 py-3 text-[12.5px] leading-relaxed text-[#B3373F]">
            Revoked accounts no longer count as active access.
            <template v-if="editingAccountRow?.revoked_at"> Revoked on {{ formatDate(editingAccountRow.revoked_at) }}.</template>
            Switching Status back to "Active" and saving will reactivate this account.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink hover:bg-[#f2f6fa]" @click="accountModalOpen = false">Cancel</button>
            <button type="button" class="rounded-[10px] border border-brand bg-brand px-[18px] py-[11px] text-sm font-semibold text-white hover:bg-brand-dk" @click="saveAccountModal">
              {{ isEditingAccount ? 'Save' : 'Add Account' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="feedback" role="status" aria-live="polite" class="fixed bottom-6 right-6 z-40 rounded-[10px] bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg">{{ feedback }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/lib/utils'
import { logActivity } from '@/lib/activity'
import { evaluateAutoSources, isRuleSatisfied } from '@/lib/autoSource'
import { ChevronDown, Check, UserPlus, Archive, Undo, UserMinus } from 'lucide-vue-next'

const auth = useAuthStore()

const fieldCls = 'h-11 w-full rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-sm leading-[1.45] text-ink transition-[border-color,box-shadow] duration-150 hover:border-[#b9c8d8] focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]'

const CATEGORY_OPTIONS = ['laptop', 'monitor', 'phone', 'access_card', 'peripheral', 'other']
const SYSTEM_OPTIONS = ['google_workspace', 'jira', 'payroll_portal', 'client_portal', 'vpn', 'building_access']

// Asset Tag Prefix Map
const TAG_PREFIXES: Record<string, string> = {
  laptop: 'LT',
  monitor: 'MN',
  phone: 'PH',
  access_card: 'AC',
  peripheral: 'PR',
  other: 'OT'
}

function generateAssetTag(category: string, existingTag?: string) {
  const prefix = TAG_PREFIXES[category] || 'OT'
  if (existingTag) {
    const parts = existingTag.split('-')
    if (parts.length >= 3) {
      return `GECO-${prefix}-${parts[parts.length - 1]}`
    }
  }
  const num = Math.floor(1000 + Math.random() * 9000)
  return `GECO-${prefix}-${num}`
}

// ----- Base state -----
const consultants = ref<any[]>([])
const assets = ref<any[]>([])
const accounts = ref<any[]>([])
const autoTasks = ref<any[]>([])
const consultantId = ref('')
const feedback = ref('')

// ----- Modals -----
const assetModalOpen = ref(false)
const isEditingAsset = ref(false)
const editingAssetId = ref<string | null>(null)
const assetForm = ref({ asset_tag: '', category: 'laptop', model: '', serial: '', status: 'in_stock', assigned_to: '' })

const accountModalOpen = ref(false)
const isEditingAccount = ref(false)
const editingAccountId = ref<string | null>(null)
const editingAccountRow = ref<any>(null)
const accountForm = ref({ consultant_id: '', system: 'google_workspace', identifier: '', status: 'active' })

// ----- ✅ FIX: Derived lists declared BEFORE anything that consumes them -----
function consultantName(id: string) { return consultants.value.find((c) => c.id === id)?.full_name || '—' }

const filteredAssets = computed(() => consultantId.value ? assets.value.filter((a) => a.assigned_to === consultantId.value) : assets.value)
const filteredAccounts = computed(() => consultantId.value ? accounts.value.filter((s) => s.consultant_id === consultantId.value) : accounts.value)

function assetPill(status: string) {
  switch (status) {
    case 'assigned': return 'bg-[#0E5A8C] text-white'
    case 'in_stock': return 'border border-[#A9C4DC] bg-[#E4EEF6] text-ink'
    case 'maintenance': return 'bg-[#B0761A] text-white'
    default: return 'bg-[#e5eaf1] text-[#7b8794]'
  }
}
function assetLabel(status: string) {
  const map: Record<string, string> = { in_stock: 'In Stock', assigned: 'Assigned', maintenance: 'Maintenance', retired: 'Retired' }
  return map[status] ?? status
}

// ----- ✅ System Accounts search + pagination (now safe: filteredAccounts exists above) -----
const ACCOUNT_PAGE_SIZE = 8
const accountSearch = ref('')
const accountPage = ref(1)

const searchedAccounts = computed(() => {
  const q = accountSearch.value.trim().toLowerCase()
  if (!q) return filteredAccounts.value
  return filteredAccounts.value.filter((s) =>
    consultantName(s.consultant_id).toLowerCase().includes(q) ||
    (s.system || '').toLowerCase().includes(q) ||
    (s.identifier || '').toLowerCase().includes(q)
  )
})

const accountPageCount = computed(() => Math.max(1, Math.ceil(searchedAccounts.value.length / ACCOUNT_PAGE_SIZE)))

const pagedAccounts = computed(() => {
  const start = (accountPage.value - 1) * ACCOUNT_PAGE_SIZE
  return searchedAccounts.value.slice(start, start + ACCOUNT_PAGE_SIZE)
})

const accountRangeStart = computed(() => (searchedAccounts.value.length === 0 ? 0 : (accountPage.value - 1) * ACCOUNT_PAGE_SIZE + 1))
const accountRangeEnd = computed(() => Math.min(searchedAccounts.value.length, accountPage.value * ACCOUNT_PAGE_SIZE))

const accountPageButtons = computed<(number | '…')[]>(() => {
  const total = accountPageCount.value
  const current = accountPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
})

function goToAccountPage(p: number) {
  if (!Number.isFinite(p)) return
  accountPage.value = Math.min(Math.max(1, p), accountPageCount.value)
}

// Reset to page 1 whenever the search or consultant filter changes
watch([accountSearch, consultantId], () => { accountPage.value = 1 })
// Clamp page if the result set shrinks
watch(accountPageCount, (max) => { if (accountPage.value > max) accountPage.value = max })

// ----- Row menus (teleported, fixed-positioned) -----
const MENU_WIDTH = 176 // w-44
const openAssetMenu = ref<string | null>(null)
const openAccountMenu = ref<string | null>(null)
const assetMenuPos = ref({ top: 0, left: 0 })
const accountMenuPos = ref({ top: 0, left: 0 })

const openAssetRow = computed(() => assets.value.find((a) => a.id === openAssetMenu.value) || null)
const openAccountRow = computed(() => accounts.value.find((s) => s.id === openAccountMenu.value) || null)

function placeMenu(rect: DOMRect, approxHeight: number) {
  let left = rect.right - MENU_WIDTH
  if (left < 8) left = 8
  let top = rect.bottom + 4
  if (top + approxHeight > window.innerHeight - 8) top = rect.top - 4 - approxHeight
  if (top < 8) top = 8
  return { top, left }
}

function toggleAssetMenu(id: string, event: MouseEvent) {
  if (openAssetMenu.value === id) { openAssetMenu.value = null; return }
  openAccountMenu.value = null
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  assetMenuPos.value = placeMenu(rect, 200)
  openAssetMenu.value = id
}

function toggleAccountMenu(id: string, event: MouseEvent) {
  if (openAccountMenu.value === id) { openAccountMenu.value = null; return }
  openAssetMenu.value = null
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  accountMenuPos.value = placeMenu(rect, 96)
  openAccountMenu.value = id
}

function closeMenus() {
  openAssetMenu.value = null
  openAccountMenu.value = null
}

// Asset menu wrappers
function menuEditAsset() { const row = openAssetRow.value; closeMenus(); if (row) openEditAsset(row) }
function menuAssignAsset() { const row = openAssetRow.value; closeMenus(); if (row) openAssign(row) }
function menuReturnAsset() { const row = openAssetRow.value; closeMenus(); if (row) returnAsset(row) }
function menuRetireAsset() { const row = openAssetRow.value; closeMenus(); if (row) retireAsset(row) }

// Account menu wrappers
function menuEditAccount() { const row = openAccountRow.value; closeMenus(); if (row) openEditAccount(row) }
function menuRevoke() { const row = openAccountRow.value; closeMenus(); if (row) revokeAccount(row) }
function menuReactivate() { const row = openAccountRow.value; closeMenus(); if (row) reactivateAccount(row) }

// Close menus on scroll/resize to avoid misalignment
onMounted(() => {
  window.addEventListener('scroll', closeMenus, true)
  window.addEventListener('resize', closeMenus)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', closeMenus, true)
  window.removeEventListener('resize', closeMenus)
})

// ----- Consultant Combobox State -----
const consultantComboOpen = ref(false)
const consultantComboText = ref('All consultants (full catalog)')
const consultantComboEditing = ref(false)

const consultantOptions = computed(() => {
  const base = [{ id: '', name: 'All consultants (full catalog)' }]
  const mapped = consultants.value.map((c: any) => ({ id: c.id, name: `${c.full_name} — ${c.job_title || 'No title'}` }))
  return [...base, ...mapped]
})

const filteredConsultantOptions = computed(() => {
  if (!consultantComboEditing.value) return consultantOptions.value
  const q = (consultantComboText.value || '').trim().toLowerCase()
  if (!q) return consultantOptions.value
  return consultantOptions.value.filter((o: any) => o.name.toLowerCase().includes(q))
})

function getConsultantLabel(id: string) {
  if (!id) return 'All consultants (full catalog)'
  const c = consultants.value.find((c: any) => c.id === id)
  return c ? `${c.full_name} — ${c.job_title || 'No title'}` : 'Unknown consultant'
}

function onConsultantComboFocus() { consultantComboEditing.value = true; consultantComboOpen.value = true }
function onConsultantComboInput(e: Event) { consultantComboText.value = (e.target as HTMLInputElement).value; consultantComboEditing.value = true; consultantComboOpen.value = true }
function onConsultantComboToggle() {
  if (consultantComboOpen.value) { closeConsultantCombo(); return }
  consultantComboEditing.value = false
  consultantComboText.value = getConsultantLabel(consultantId.value)
  consultantComboOpen.value = true
}
function selectConsultantCombo(opt: { id: string; name: string }) {
  consultantId.value = opt.id
  consultantComboText.value = opt.name
  consultantComboEditing.value = false
  consultantComboOpen.value = false
  loadAutomation()
}
function closeConsultantCombo() {
  const text = (consultantComboText.value || '').trim()
  const exact = consultantOptions.value.find((o: any) => o.name.toLowerCase() === text.toLowerCase())
  if (exact) { consultantId.value = exact.id; consultantComboText.value = exact.name }
  else if (!text || text.toLowerCase() === 'all consultants (full catalog)') { consultantId.value = ''; consultantComboText.value = 'All consultants (full catalog)' }
  else { consultantComboText.value = getConsultantLabel(consultantId.value) }
  consultantComboEditing.value = false
  consultantComboOpen.value = false
  loadAutomation()
}
function onConsultantComboBlur() { closeConsultantCombo() }
function onConsultantComboEscape() { consultantComboText.value = getConsultantLabel(consultantId.value); consultantComboEditing.value = false; consultantComboOpen.value = false }
function onConsultantComboEnter() {
  const list = filteredConsultantOptions.value
  const text = (consultantComboText.value || '').trim().toLowerCase()
  const exact = list.find((o: any) => o.name.toLowerCase() === text)
  if (exact) return selectConsultantCombo(exact)
  if (list.length === 1) return selectConsultantCombo(list[0])
}

// ----- Data loading -----
onMounted(async () => {
  const { data: cons } = await supabase.from('consultants').select('id, full_name, job_title').order('full_name')
  consultants.value = cons || []
  await refreshAll()
})

async function refreshAll() {
  const [a, s] = await Promise.all([
    supabase.from('assets').select('*').order('created_at', { ascending: false }),
    supabase.from('system_accounts').select('*').order('created_at', { ascending: false }),
  ])
  assets.value = a.data || []
  accounts.value = s.data || []
  await loadAutomation()
}

async function loadAutomation() {
  autoTasks.value = []
  if (!consultantId.value) return
  const { data: obs } = await supabase.from('offboardings').select('id').eq('consultant_id', consultantId.value).in('status', ['sent', 'in_progress'])
  for (const ob of obs || []) {
    const { data: reqs } = await supabase.from('offboarding_requirements').select('id').eq('offboarding_id', ob.id)
    const ids = (reqs || []).map((r: any) => r.id)
    if (!ids.length) continue
    const { data: subs } = await supabase.from('offboarding_sub_requirements').select('id, title, status, auto_source').in('offboarding_requirement_id', ids).not('auto_source', 'is', null)
    for (const s of subs || []) {
      autoTasks.value.push({ ...s, satisfied: await isRuleSatisfied(supabase, s.auto_source, consultantId.value) })
    }
  }
}

// ----- Asset actions -----
function openAddAsset() {
  isEditingAsset.value = false
  editingAssetId.value = null
  assetForm.value = { asset_tag: generateAssetTag('laptop'), category: 'laptop', model: '', serial: '', status: 'in_stock', assigned_to: '' }
  assetModalOpen.value = true
}

function openEditAsset(a: any) {
  isEditingAsset.value = true
  editingAssetId.value = a.id
  assetForm.value = { asset_tag: a.asset_tag, category: a.category, model: a.model || '', serial: a.serial || '', status: a.status, assigned_to: a.assigned_to || '' }
  assetModalOpen.value = true
}

function openAssign(a: any) {
  isEditingAsset.value = true
  editingAssetId.value = a.id
  assetForm.value = { asset_tag: a.asset_tag, category: a.category, model: a.model || '', serial: a.serial || '', status: 'assigned', assigned_to: a.assigned_to || '' }
  assetModalOpen.value = true
}

function onCategoryChange() {
  assetForm.value.asset_tag = generateAssetTag(assetForm.value.category, isEditingAsset.value ? assetForm.value.asset_tag : undefined)
}

async function saveAssetModal() {
  const payload: any = {
    category: assetForm.value.category,
    model: assetForm.value.model || null,
    serial: assetForm.value.serial || null,
    status: assetForm.value.status,
    assigned_to: assetForm.value.status === 'assigned' ? assetForm.value.assigned_to : null,
  }

  if (isEditingAsset.value) {
    if (assetForm.value.status === 'assigned') { payload.assigned_at = new Date().toISOString(); payload.returned_at = null }
    else { payload.returned_at = new Date().toISOString(); payload.assigned_at = null }

    const { error } = await supabase.from('assets').update(payload).eq('id', editingAssetId.value)
    if (error) return showFeedback(`Failed: ${error.message}`)
    showFeedback('Asset updated.')
  } else {
    payload.asset_tag = assetForm.value.asset_tag
    if (assetForm.value.status === 'assigned') payload.assigned_at = new Date().toISOString()

    const { error } = await supabase.from('assets').insert(payload)
    if (error) return showFeedback(`Failed: ${error.message}`)
    showFeedback('Asset added to catalog.')
  }
  assetModalOpen.value = false
  await refreshAll()
}

async function returnAsset(a: any) {
  if (!confirm(`Mark ${a.asset_tag} as returned?`)) return
  const holderId = a.assigned_to
  const { error } = await supabase.from('assets').update({ status: 'in_stock', returned_at: new Date().toISOString(), assigned_to: null }).eq('id', a.id)
  if (error) return showFeedback(`Failed: ${error.message}`)
  logActivity('asset.returned', 'asset', a.id, { asset_tag: a.asset_tag, consultant_id: holderId })

  if (holderId) {
    const completed = await evaluateAutoSources(supabase, holderId)
    if (completed.length) showFeedback(`Returned. Auto-completed: ${completed.join(', ')}`)
    else showFeedback(`${a.asset_tag} returned.`)
  } else showFeedback(`${a.asset_tag} returned.`)
  await refreshAll()
}

async function retireAsset(a: any) {
  if (!confirm(`Retire ${a.asset_tag}? It will no longer be assignable.`)) return
  const { error } = await supabase.from('assets').update({ status: 'retired' }).eq('id', a.id)
  if (error) return showFeedback(`Failed: ${error.message}`)
  showFeedback(`${a.asset_tag} retired.`)
  await refreshAll()
}

// ----- Account actions -----
function openAddAccount() {
  isEditingAccount.value = false
  editingAccountId.value = null
  editingAccountRow.value = null
  accountForm.value = { consultant_id: consultantId.value || '', system: 'google_workspace', identifier: '', status: 'active' }
  accountModalOpen.value = true
}

function openEditAccount(s: any) {
  isEditingAccount.value = true
  editingAccountId.value = s.id
  editingAccountRow.value = s
  accountForm.value = { consultant_id: s.consultant_id, system: s.system, identifier: s.identifier || '', status: s.status }
  accountModalOpen.value = true
}

async function saveAccountModal() {
  // Consultant is only selectable on create; on edit it is fixed
  if (!isEditingAccount.value && !accountForm.value.consultant_id) return showFeedback('Select a consultant.')

  if (isEditingAccount.value && editingAccountId.value) {
    const original = editingAccountRow.value
    const payload: any = {
      consultant_id: accountForm.value.consultant_id,
      system: accountForm.value.system,
      identifier: accountForm.value.identifier.trim() || null,
      status: accountForm.value.status,
    }
    const nowRevoked = accountForm.value.status === 'revoked' && original?.status !== 'revoked'
    const nowActive = accountForm.value.status === 'active' && original?.status === 'revoked'
    if (nowRevoked) { payload.revoked_at = new Date().toISOString(); payload.revoked_by = auth.user?.id }
    if (nowActive) { payload.revoked_at = null; payload.revoked_by = null }

    const { error } = await supabase.from('system_accounts').update(payload).eq('id', editingAccountId.value)
    if (error) return showFeedback(`Failed: ${error.message}`)
    accountModalOpen.value = false

    if (nowRevoked) {
      logActivity('account.revoked', 'system_account', editingAccountId.value, { system: payload.system, consultant_id: payload.consultant_id, via: 'edit-modal' })
      const completed = await evaluateAutoSources(supabase, payload.consultant_id)
      if (completed.length) showFeedback(`Revoked. Auto-completed: ${completed.join(', ')}`)
      else showFeedback('System account revoked.')
    } else {
      logActivity('account.updated', 'system_account', editingAccountId.value, { system: payload.system, status: payload.status })
      showFeedback(nowActive ? 'System account reactivated.' : 'System account updated.')
    }
  } else {
    const { error } = await supabase.from('system_accounts').insert({
      consultant_id: accountForm.value.consultant_id,
      system: accountForm.value.system,
      identifier: accountForm.value.identifier.trim() || null,
      status: 'active',
    })
    if (error) return showFeedback(`Failed: ${error.message}`)
    accountModalOpen.value = false
    showFeedback('System account registered.')
  }
  await refreshAll()
}

async function revokeAccount(s: any) {
  if (!confirm(`Revoke ${s.system} access for ${consultantName(s.consultant_id)}?`)) return
  const { error } = await supabase.from('system_accounts').update({ status: 'revoked', revoked_at: new Date().toISOString(), revoked_by: auth.user?.id }).eq('id', s.id)
  if (error) return showFeedback(`Failed: ${error.message}`)
  logActivity('account.revoked', 'system_account', s.id, { system: s.system, consultant_id: s.consultant_id })
  const completed = await evaluateAutoSources(supabase, s.consultant_id)
  if (completed.length) showFeedback(`Revoked. Auto-completed: ${completed.join(', ')}`)
  else showFeedback(`${s.system} revoked.`)
  await refreshAll()
}

async function reactivateAccount(s: any) {
  const { error } = await supabase.from('system_accounts').update({ status: 'active', revoked_at: null, revoked_by: null }).eq('id', s.id)
  if (error) return showFeedback(`Failed: ${error.message}`)
  logActivity('account.reactivated', 'system_account', s.id, { system: s.system })
  showFeedback(`${s.system} reactivated.`)
  await refreshAll()
}

function showFeedback(msg: string) { feedback.value = msg; setTimeout(() => { feedback.value = '' }, 4000) }
</script>