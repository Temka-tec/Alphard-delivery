"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserCircle2,
  UserPlus,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRipple } from "@/hooks/use-ripple";
import { navItems } from "./landing-data";

type HeaderClientProps = {
  isAdmin: boolean;
  isSignedIn: boolean;
  displayName: string | null;
  displayEmail: string | null;
  isDriver: boolean;
  hasDriverApplication: boolean;
};

export const HeaderClient = ({
  isAdmin,
  isSignedIn,
  displayName,
  displayEmail,
  isDriver,
  hasDriverApplication,
}: HeaderClientProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const ripple = useRipple();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const isNavActive = (href: string) => {
    if (href.startsWith("#")) {
      return false;
    }
    return pathname === href;
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const showDriverOverview = isDriver || hasDriverApplication;
  const primaryAccountHref = showDriverOverview ? "/driver/dashboard" : "/driver/profile";
  const primaryAccountLabel = isDriver
    ? "Dashboard"
    : showDriverOverview
      ? "Хүсэлтийн самбар"
      : "Профайл";
  const secondaryAccountHref = showDriverOverview ? "/driver/profile" : "/driver/register";
  const secondaryAccountLabel = showDriverOverview ? "Жолоочийн мэдээлэл" : "Жолооч болох";
  const statusLabel = isAdmin
    ? "Админ"
    : isDriver
      ? "Жолооч"
      : hasDriverApplication
        ? "Хүсэлт илгээсэн"
        : "Хэрэглэгч";

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | PointerEvent) => {
      if (
        profileMenuRef.current &&
        event.target instanceof Node &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-text)]/8 bg-[var(--color-header-bg)] backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Col 1: Logo */}
          <Link
            href="/"
            className="font-display text-xl font-extrabold tracking-[-0.04em] text-[var(--color-text)] sm:text-2xl"
          >
            ALPHARD<span className="text-[var(--color-gold)]">.</span>
          </Link>

          {/* Col 2: Desktop nav — perfectly centered */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={[
                  "nav-underline text-sm transition",
                  isNavActive(item.href)
                    ? "active text-[var(--color-text)]"
                    : "text-[var(--color-muted)]",
                ].join(" ")}
              >
                {item.label}
              </a>
            ))}
            {isAdmin ? (
              <Link
                href="/admin/driver-applications"
                className={[
                  "nav-underline text-sm font-medium transition",
                  pathname.startsWith("/admin")
                    ? "active text-[var(--color-gold)]"
                    : "text-[var(--color-gold)]",
                ].join(" ")}
              >
                Админ
              </Link>
            ) : null}
          </nav>

          {/* Col 3: Actions (desktop) + mobile toggle */}
          <div className="col-start-3 flex items-center justify-end gap-3">
            {/* Desktop actions */}
            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle />
              {!isSignedIn ? (
                <>
                  <Link
                    href="/sign-in"
                    className="rounded-lg border border-[rgba(201,168,76,0.4)] px-4 py-2 text-sm text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.1)]"
                  >
                    Нэвтрэх
                  </Link>
                  <button
                    type="button"
                    onClick={(event) => {
                      ripple(event);
                      router.push("/sign-up");
                    }}
                    className="btn-shine btn-ripple-effect rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
                  >
                    Бүртгүүлэх
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      ripple(event);
                      router.push("/booking");
                    }}
                    className="btn-shine btn-ripple-effect rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
                  >
                    Захиалах
                  </button>

                  <div className="relative" ref={profileMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen((current) => !current)}
                      className="flex h-11 items-center gap-3 rounded-full border border-[rgba(201,168,76,0.24)] bg-[rgba(201,168,76,0.08)] px-2.5 py-1.5 text-left transition hover:bg-[rgba(201,168,76,0.12)]"
                      aria-haspopup="menu"
                      aria-expanded={isProfileOpen}
                      title={displayName ?? "Профайл"}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(201,168,76,0.18)] text-sm font-semibold text-[var(--color-gold)] ring-1 ring-[rgba(201,168,76,0.25)]">
                        {displayName?.slice(0, 1)?.toUpperCase() ?? "U"}
                      </span>
                      <span className="hidden max-w-32 flex-col leading-tight xl:flex">
                        <span className="truncate text-sm font-medium text-[var(--color-text)]">
                          {displayName ?? "Профайл"}
                        </span>
                        <span className="truncate text-xs text-[var(--color-muted)]">
                          {statusLabel}
                        </span>
                      </span>
                      <ChevronDown
                        size={16}
                        className={[
                          "text-[var(--color-muted)] transition",
                          isProfileOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>

                    {isProfileOpen ? (
                      <div
                        role="menu"
                        aria-label="Account menu"
                        className="absolute right-0 top-[calc(100%+0.75rem)] w-80 overflow-hidden rounded-2xl border border-[var(--color-text)]/10 bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
                      >
                        <div className="border-b border-[var(--color-text)]/8 px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(201,168,76,0.14)] text-base font-semibold text-[var(--color-gold)] ring-1 ring-[rgba(201,168,76,0.24)]">
                              {displayName?.slice(0, 1)?.toUpperCase() ?? "U"}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-medium text-[var(--color-text)]">
                                {displayName ?? "Хэрэглэгч"}
                              </div>
                              <div className="truncate text-sm text-[var(--color-muted)]">
                                {displayEmail ?? "И-мэйл байхгүй"}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 inline-flex rounded-full border border-[rgba(201,168,76,0.24)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
                            {statusLabel}
                          </div>
                        </div>

                        <div className="p-2">
                          <Link
                            href="/driver/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--color-text)] transition hover:bg-[var(--color-panel)]"
                            role="menuitem"
                          >
                            <UserCircle2 size={16} className="text-[var(--color-muted)]" />
                            Профайл
                          </Link>
                          {showDriverOverview ? (
                            <Link
                              href={primaryAccountHref}
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--color-text)] transition hover:bg-[var(--color-panel)]"
                              role="menuitem"
                            >
                              <LayoutDashboard size={16} className="text-[var(--color-muted)]" />
                              {primaryAccountLabel}
                            </Link>
                          ) : null}
                          {isAdmin ? (
                            <Link
                              href="/admin/driver-applications"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--color-gold)] transition hover:bg-[var(--color-panel)]"
                              role="menuitem"
                            >
                              <ShieldCheck size={16} />
                              Админ хэсэг
                            </Link>
                          ) : null}
                          <Link
                            href={secondaryAccountHref}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-text)]"
                            role="menuitem"
                          >
                            <UserPlus size={16} />
                            {secondaryAccountLabel}
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileOpen(false);
                              void handleSignOut();
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#F87171] transition hover:bg-[rgba(248,113,113,0.08)]"
                            role="menuitem"
                          >
                            <LogOut size={16} />
                            Гарах
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsMenuOpen((c) => !c)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-text)]/10 text-[var(--color-text)]"
                aria-label="Menu нээх"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="fade-in-up mt-4 rounded-2xl border border-[var(--color-text)]/8 bg-[var(--color-surface)] p-4 md:hidden">
            {isSignedIn ? (
              <div className="mb-4 rounded-2xl border border-[rgba(201,168,76,0.14)] bg-[rgba(201,168,76,0.06)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(201,168,76,0.16)] text-sm font-semibold text-[var(--color-gold)]">
                    {displayName?.slice(0, 1)?.toUpperCase() ?? "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-[var(--color-text)]">
                      {displayName ?? "Хэрэглэгч"}
                    </div>
                    <div className="truncate text-xs text-[var(--color-muted)]">
                      {displayEmail ?? "И-мэйл байхгүй"}
                    </div>
                  </div>
                </div>
                <div className="mt-3 inline-flex rounded-full border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
                  {statusLabel}
                </div>
              </div>
            ) : null}

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-gold)]"
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin ? (
                <Link
                  href="/admin/driver-applications"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-gold)] transition hover:bg-[var(--color-panel)]"
                >
                  Админ
                </Link>
              ) : null}
            </nav>

            <div className="mt-4 grid gap-2">
              {!isSignedIn ? (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg border border-[rgba(201,168,76,0.4)] px-4 py-3 text-center text-sm text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.1)]"
                  >
                    Нэвтрэх
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-shine rounded-lg bg-[var(--color-gold)] px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)]"
                  >
                    Бүртгүүлэх
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/driver/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-gold)]"
                  >
                    Профайл
                  </Link>
                  {showDriverOverview ? (
                    <Link
                      href={primaryAccountHref}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-gold)]"
                    >
                      {primaryAccountLabel}
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <Link
                      href="/admin/driver-applications"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-gold)] transition hover:bg-[var(--color-panel)]"
                    >
                      Админ хэсэг
                    </Link>
                  ) : null}
                  <Link
                    href={secondaryAccountHref}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-gold)]"
                  >
                    {secondaryAccountLabel}
                  </Link>
                  <Link
                    href="/booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-shine rounded-lg bg-[var(--color-gold)] px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)]"
                  >
                    Захиалах
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      void handleSignOut();
                    }}
                    className="rounded-lg border border-[rgba(248,113,113,0.18)] px-4 py-3 text-center text-sm text-[#F87171] transition hover:bg-[rgba(248,113,113,0.08)]"
                  >
                    Гарах
                  </button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};
