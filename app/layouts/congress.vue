<script setup lang="ts">
import {
    Gavel,
    FileText,
    LogOut,
    User,
    Sun,
    Moon,
    Menu,
    X,
    ChevronDown,
} from "lucide-vue-next";
import { siteNavigation } from "../../config/navigation";

const { user, clear } = useUserSession();
const config = useRuntimeConfig().public;
const colorMode = useColorMode();

const isMobileMenuOpen = ref(false);

const toggleTheme = () => {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
    <div class="app-layout">
        <header class="mobile-header md:hidden container-fluid">
            <nav>
                <ul>
                    <li>
                        <button
                            class="outline contrast"
                            @click="isMobileMenuOpen = true"
                        >
                            <Menu :size="20" />
                        </button>
                    </li>
                    <li>
                        <strong>{{ config.name }}</strong>
                    </li>
                </ul>
            </nav>
        </header>

        <div class="layout-wrapper container-fluid">
            <aside :class="{ open: isMobileMenuOpen }" class="sidebar">
                <nav>
                    <ul>
                        <li class="sidebar-header">
                            <div
                                class="flex items-center justify-between w-full"
                            >
                                <span class="font-bold text-xl">{{
                                    config.shortName
                                }}</span>
                                <button
                                    class="md:hidden outline secondary"
                                    @click="isMobileMenuOpen = false"
                                >
                                    <X :size="16" />
                                </button>
                            </div>
                        </li>

                        <li v-if="user" class="user-info">
                            <details class="dropdown">
                                <summary class="secondary outline">
                                    <User :size="16" class="inline mr-2" />
                                    {{ user.shortName || "使用者簡稱未定義" }}
                                </summary>
                                <ul dir="rtl">
                                    <li>
                                        <a href="#" @click.prevent="clear"
                                            ><LogOut :size="14" class="mr-2" />
                                            登出</a
                                        >
                                    </li>
                                </ul>
                            </details>
                        </li>

                        <hr />

                        <li v-for="item in siteNavigation" :key="item.name">
                            <details>
                                <summary>
                                    <component
                                        :is="item.icon"
                                        :size="18"
                                        class="inline mr-2"
                                    />
                                    {{ item.name }}
                                </summary>
                                <ul>
                                    <li
                                        v-for="sub in item.children"
                                        :key="sub.name"
                                    >
                                        <NuxtLink
                                            :to="sub.href"
                                            @click="isMobileMenuOpen = false"
                                            >{{ sub.name }}</NuxtLink
                                        >
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>

                    <ul class="sidebar-footer">
                        <li>
                            <button
                                @click="toggleTheme"
                                class="outline contrast w-full"
                            >
                                <Sun
                                    v-if="colorMode.value === 'dark'"
                                    :size="18"
                                />
                                <Moon v-else :size="18" />
                                <span class="ml-2">{{
                                    colorMode.value === "dark"
                                        ? "亮色模式"
                                        : "暗色模式"
                                }}</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main class="content">
                <slot />

                <footer class="main-footer">
                    <hr />
                    <p>
                        <small>
                            © 2026 {{ config.copyright }}<br />
                            <span class="text-xs opacity-70"
                                >{{ config.name }} -
                                立法自動化．議事資訊化</span
                            >
                        </small>
                    </p>
                </footer>
            </main>
        </div>
    </div>
</template>

<style scoped>
.layout-wrapper {
    display: flex;
    min-height: 100vh;
    padding-top: 0;
}

.sidebar {
    width: 280px;
    border-right: 1px solid var(--pico-muted-border-color);
    padding: 1rem;
    background: var(--pico-background-color);
    transition: transform 0.3s ease;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 1000;
}

.content {
    flex: 1;
    padding: 2rem;
    min-width: 0;
}

.sidebar-header {
    padding-bottom: 1rem;
}

.sidebar-footer {
    margin-top: auto;
    padding-top: 1rem;
}

.mobile-header {
    border-bottom: 1px solid var(--pico-muted-border-color);
    background: var(--pico-background-color);
}

/* 手機版 RWD 設定 */
@media (max-width: 992px) {
    .sidebar {
        position: fixed;
        left: 0;
        transform: translateX(-100%);
    }

    .sidebar.open {
        transform: translateX(0);
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
    }

    .content {
        padding: 1rem;
    }
}

.user-info summary {
    font-size: 0.9rem;
}

.main-footer {
    margin-top: 4rem;
    text-align: center;
}
</style>
