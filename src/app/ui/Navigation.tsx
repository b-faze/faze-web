"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navigation() {
  const currPath = usePathname()

  const items = useMemo<NavigationItem[]>(() => ([
    { name: 'Dashboard', href: '/' },
    { name: 'Games', href: '/games' },
    { name: 'Create', href: '/games/create' },
  ]).map(item => ({...item, current: currPath === item.href})), [currPath])

  return (
    <div>
      {/* navbar */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            FAZE
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {items.map((item) => (
                <li key={item.name} className="nav-item">
                  <Link
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames("nav-link",
                      item.current ? "" : "active",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
