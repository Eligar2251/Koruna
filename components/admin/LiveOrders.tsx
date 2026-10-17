"use client";
import { useEffect, useRef, useState } from "react";
import { adminApi } from "./api";
import type { Order } from "./Operations";
export function LiveOrders({
  onOrders,
}: {
  onOrders: (orders: Order[]) => void;
}) {
  const callback = useRef(onOrders);
  callback.current = onOrders;
  const [state, setState] = useState("Подключение…"),
    [notice, setNotice] = useState(""),
    [permission, setPermission] = useState("default"),
    [enabled, setEnabled] = useState(false),
    [pending, setPending] = useState(false);
  useEffect(() => {
    if ("Notification" in window) setPermission(Notification.permission);
    else setPermission("unsupported");
    try {
      setEnabled(localStorage.getItem("csb-notifications") === "enabled");
    } catch {}
    let seen: Set<string> | null = null,
      stopped = false,
      fallback: ReturnType<typeof setInterval> | undefined;
    const accept = (orders: Order[]) => {
      if (stopped) return;
      const added = seen ? orders.filter((order) => !seen!.has(order.id)) : [];
      seen = new Set(orders.map((o) => o.id));
      callback.current(orders);
      if (added.length) {
        setNotice(`Новых заявок: ${added.length}. Откройте раздел «Заказы».`);
        let allowed = false;
        try {
          allowed = localStorage.getItem("csb-notifications") === "enabled";
        } catch {}
        if (
          allowed &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          try {
            const n = new Notification("Новая заявка — ЦСБ", {
              body: "Проверьте панель управления. Персональные данные скрыты.",
              icon: "/assets/favicon.png",
              tag: "csb-new-orders",
            });
            n.onclick = () => {
              window.focus();
              n.close();
            };
          } catch {
            setNotice(
              "Новая заявка. Системные уведомления недоступны — откройте раздел «Заказы».",
            );
          }
        }
      }
    };
    const poll = async () => {
      try {
        const data = await adminApi("/api/admin/orders");
        accept(data.orders || []);
        if (!stopped) setState("Автообновление · 5 секунд");
      } catch {
        if (!stopped) setState("Связь потеряна · повторяем подключение");
      }
    };
    const events = new EventSource("/api/admin/orders/events");
    events.addEventListener("snapshot", (event) => {
      if (stopped) return;
      try {
        accept(JSON.parse((event as MessageEvent).data).orders || []);
        setState("Заявки · в реальном времени");
        if (fallback) {
          clearInterval(fallback);
          fallback = undefined;
        }
      } catch {}
    });
    const recover = () => {
      if (stopped) return;
      setState("Восстанавливаем связь…");
      if (!fallback) {
        void poll();
        fallback = setInterval(poll, 5000);
      }
    };
    events.addEventListener("unavailable", recover);
    events.onerror = recover;
    return () => {
      stopped = true;
      events.close();
      clearInterval(fallback);
    };
  }, []);
  async function notifications() {
    if (!("Notification" in window) || !window.isSecureContext) {
      setNotice(
        "Уведомления требуют HTTPS и поддержки браузером. В панели заявки обновляются автоматически.",
      );
      return;
    }
    setPending(true);
    try {
      if (enabled) {
        localStorage.setItem("csb-notifications", "disabled");
        setEnabled(false);
        setNotice("Уведомления выключены.");
        return;
      }
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        localStorage.setItem("csb-notifications", "enabled");
        setEnabled(true);
        setNotice("Уведомления включены, пока панель открыта.");
      } else
        setNotice(
          "Разрешите уведомления в настройках браузера. Внутри панели они продолжают работать.",
        );
    } catch {
      setNotice(
        "Браузер не разрешил уведомления. Попробуйте открыть сайт отдельной вкладкой и проверьте настройки разрешений.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="live-orders">
      <span role="status">● {state}</span>
      <button
        type="button"
        className="ghost"
        disabled={permission === "unsupported" || pending}
        onClick={notifications}
      >
        {permission === "unsupported"
          ? "Уведомления не поддерживаются"
          : enabled
            ? "Выключить уведомления"
            : "Включить браузерные уведомления"}
      </button>
      {notice && (
        <p role="status">
          {notice}
          <button type="button" className="ghost" onClick={() => setNotice("")}>
            Скрыть
          </button>
        </p>
      )}
      <small>
        Уведомления работают при открытой панели; это не push-сервис для
        закрытого браузера.
      </small>
    </div>
  );
}
