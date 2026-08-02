(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});
// Перехватчик запросов: добавление токена
api.interceptors.request.use((config)=>{
    // В Next.js нужно убедиться, что код выполняется на клиенте
    if ("TURBOPACK compile-time truthy", 1) {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
}, (error)=>Promise.reject(error));
// Переменные для механизма обновления токена
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null)=>{
    failedQueue.forEach((prom)=>{
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
// Перехватчик ответов: обработка ошибки 401
api.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    // Если ошибка 401 и мы еще не пытались повторить этот запрос
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
            // Если токен уже обновляется другим запросом, ставим этот запрос в очередь
            return new Promise((resolve, reject)=>{
                failedQueue.push({
                    resolve,
                    reject
                });
            }).then((token)=>{
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return api(originalRequest);
            }).catch((err)=>Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
            const refreshToken = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('refreshToken') : "TURBOPACK unreachable";
            if (!refreshToken) {
                throw new Error('Refresh token missing');
            }
            // Делаем чистый запрос через обычный axios, чтобы не зациклить интерсепторы
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('http://localhost:3000/auth/refresh', {}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                }
            });
            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
            }
            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            processQueue(null, newAccessToken);
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            // Если не удалось обновить токен — очищаем данные и редиректим на логин
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
        } finally{
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        isAuthenticated: false,
        isLoading: true,
        login: async (data)=>{
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/auth/login', data);
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            set({
                isAuthenticated: true
            });
        },
        register: async (data)=>{
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/auth/register', data);
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            set({
                isAuthenticated: true
            });
        },
        logout: ()=>{
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({
                isAuthenticated: false
            });
            window.location.href = '/auth/login';
        },
        checkAuth: ()=>{
            const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('accessToken') : "TURBOPACK unreachable";
            set({
                isAuthenticated: !!token,
                isLoading: false
            });
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/guards/GuestGuard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GuestGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function GuestGuard({ children }) {
    _s();
    const { isAuthenticated, isLoading, checkAuth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GuestGuard.useEffect": ()=>{
            checkAuth();
        }
    }["GuestGuard.useEffect"], [
        checkAuth
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GuestGuard.useEffect": ()=>{
            if (!isLoading && isAuthenticated) {
                router.replace('/clients'); // Временно перенаправляем на /clients, пока нет дашборда
            }
        }
    }["GuestGuard.useEffect"], [
        isLoading,
        isAuthenticated,
        router
    ]);
    if (isLoading || isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: "Загрузка..."
        }, void 0, false, {
            fileName: "[project]/src/components/guards/GuestGuard.tsx",
            lineNumber: 21,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(GuestGuard, "Olfp5AvE8FNGkqsavTJRXzKLHIw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = GuestGuard;
var _c;
__turbopack_context__.k.register(_c, "GuestGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1u-07s9._.js.map