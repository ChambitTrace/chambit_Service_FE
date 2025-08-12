import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './SidebarStyle.css'

interface MenuItem {
  id: string;
  label: string;
  subItems?: MenuItem[];
}

export default function Sidebar() {
  const [openParent, setOpenParent] = useState<string | null>('resource');
  const [activeItem, setActiveItem] = useState<string>('cluster-list');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Expecting paths like "/sbom/build_upload" or "/resource/cluster_list"
    const segments = location.pathname.split('/').filter(Boolean);
    const parent = segments[0];
    const child = segments[1];
    if (parent) setOpenParent(parent);
    if (child) setActiveItem(child);
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    {
      id: 'resource', label: 'Resource',
      subItems: [
        { id: 'cluster_list', label: 'cluster list' },
        { id: 'namespace_list', label: 'namespace list' },
        { id: 'status', label: 'status' },
      ],
    },
    {
      id: 'sbom',
      label: 'SBOM',
      subItems: [
        { id: 'build_upload', label: 'Build upload' },
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

  const handleSubItemClick = (itemid: string, subid: string) => {
    setOpenParent(itemid);
    setActiveItem(subid);
    navigate(`/${itemid}/${subid}`);
  };
  

  return (
    <nav className="sidebar">
      {/* User Info Section */}
      <a
        href="/dashboard"
        className="sidebar-logo"
      >
        <img src="../../../public/logo.webp"/>
      </a>
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
                      handleSubItemClick(item.id ,subItem.id);
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
