import React, { useState } from 'react'
import './SidebarStyle.css'

interface MenuItem {
  id: string;
  label: string;
  subItems?: MenuItem[];
}

export default function Sidebar() {
  const [openParent, setOpenParent] = useState<string | null>('resource');
  const [activeItem, setActiveItem] = useState<string>('cluster-list');

  const menuItems: MenuItem[] = [
    {
      id: 'resource', label: 'resource',
      subItems: [
        { id: 'cluster-list', label: 'cluster list' },
        { id: 'namespace-list', label: 'namespace list' },
        { id: 'status', label: 'status' },
      ],
    },
    {
      id: 'sbom',
      label: 'SBOM',
      subItems: [
        { id: 'build-upload', label: 'Build upload' },
        { id: 'management', label: 'Management' },
      ],
    },
    {
      id: 'policy',
      label: 'Policy',
      subItems: [
        { id: 'cve', label: 'CVE' },
        { id: 'drift', label: 'Drift' },
        { id: 'license', label: 'license' },
      ],
    },
  ];

  const handleParentClick = (id: string) => {
    setOpenParent(openParent === id ? null : id);
  };

  const handleSubItemClick = (id: string) => {
    setActiveItem(id);
  };

  return (
    <nav className="sidebar">
      {/* User Info Section */}
      <div className="sidebar-user-info">user</div>

      {/* Main Menu */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            <li
              className={`sidebar-menu-item ${openParent === item.id ? 'active' : ''}`}
              onClick={() => handleParentClick(item.id)}
            >
              {item.label}
            </li>
            {item.subItems && (
              <ul className={`sidebar-submenu ${openParent === item.id ? 'open' : ''}`}>
                {item.subItems.map((subItem) => (
                  <li
                    key={subItem.id}
                    className={`sidebar-submenu-item ${activeItem === subItem.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubItemClick(subItem.id);
                    }}
                  >
                    {subItem.label}
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>

      {/* Version Info Section */}
      <div className="sidebar-version-info">version</div>
    </nav>
  );
}
