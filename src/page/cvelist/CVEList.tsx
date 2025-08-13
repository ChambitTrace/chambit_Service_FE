import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import RGL, { WidthProvider } from "react-grid-layout"
import Sidebar from "../sidebar/Sidebar"
import "./CVEListStyle.css"

const ReactGridLayout = WidthProvider(RGL)

interface CVE {
  cveId: string
  package: string
  severity: {
    level: "Critical" | "Attention" | "Interest"
    score: number
  }
  summary: string
  description: string
  affected: Array<{
    package: string
    version: string
    path: string
  }>
  remediation: string
  publishedAt: string
  updatedAt: string
  references: Array<{
    title: string
    url: string
  }>
  tags: string[]
}

export const mockCVEs: CVE[] = [
  {
    cveId: "CVE-2024-12345",
    package: "openssl",
    severity: { level: "Critical", score: 9.8 },
    summary: "Buffer overflow in OpenSSL certificate parsing",
    description:
      "A critical buffer overflow vulnerability exists in OpenSSL's certificate parsing functionality that could allow remote code execution.",
    affected: [
      { package: "openssl", version: "1.1.1k", path: "/usr/lib/x86_64-linux-gnu/libssl.so.1.1" },
      { package: "libssl-dev", version: "1.1.1k-1", path: "/usr/include/openssl/" },
    ],
    remediation: "Update to OpenSSL version 3.0.2 or later. Apply security patches immediately.",
    publishedAt: "2024-01-15",
    updatedAt: "2024-01-20",
    references: [
      { title: "OpenSSL Security Advisory", url: "https://openssl.org/news/secadv/20240115.txt" },
      { title: "CVE Details", url: "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-12345" },
    ],
    tags: ["RCE", "Buffer Overflow", "Certificate"],
  },
  {
    cveId: "CVE-2024-12346",
    package: "nginx",
    severity: { level: "Attention", score: 7.5 },
    summary: "HTTP request smuggling in nginx proxy module",
    description:
      "An HTTP request smuggling vulnerability in nginx's proxy module could allow attackers to bypass security controls.",
    affected: [
      { package: "nginx", version: "1.18.0", path: "/usr/sbin/nginx" },
      { package: "nginx-common", version: "1.18.0-1", path: "/etc/nginx/" },
    ],
    remediation: "Upgrade nginx to version 1.20.2 or configure proper request validation.",
    publishedAt: "2024-01-10",
    updatedAt: "2024-01-18",
    references: [{ title: "Nginx Security Advisory", url: "https://nginx.org/en/security_advisories.html" }],
    tags: ["HTTP Smuggling", "Proxy"],
  },
  {
    cveId: "CVE-2024-12347",
    package: "curl",
    severity: { level: "Interest", score: 4.3 },
    summary: "Information disclosure in curl URL parsing",
    description:
      "A minor information disclosure vulnerability in curl's URL parsing could leak sensitive data in specific configurations.",
    affected: [
      { package: "curl", version: "7.68.0", path: "/usr/bin/curl" },
      { package: "libcurl4", version: "7.68.0-1", path: "/usr/lib/x86_64-linux-gnu/libcurl.so.4" },
    ],
    remediation: "Update curl to version 7.85.0 or later when convenient.",
    publishedAt: "2024-01-05",
    updatedAt: "2024-01-12",
    references: [{ title: "curl Security", url: "https://curl.se/docs/security.html" }],
    tags: ["Information Disclosure", "URL Parsing"],
  },
  {
    cveId: "CVE-2024-12348",
    package: "apache2",
    severity: { level: "Critical", score: 9.1 },
    summary: "Remote code execution in Apache HTTP Server",
    description: "A critical remote code execution vulnerability in Apache HTTP Server's mod_rewrite module.",
    affected: [
      { package: "apache2", version: "2.4.41", path: "/usr/sbin/apache2" },
      { package: "apache2-bin", version: "2.4.41-4", path: "/usr/lib/apache2/modules/" },
    ],
    remediation: "Immediately update Apache to version 2.4.54 or disable mod_rewrite if not needed.",
    publishedAt: "2024-01-20",
    updatedAt: "2024-01-25",
    references: [{ title: "Apache Security", url: "https://httpd.apache.org/security/" }],
    tags: ["RCE", "mod_rewrite"],
  },
  {
    cveId: "CVE-2024-12349",
    package: "python3",
    severity: { level: "Attention", score: 6.8 },
    summary: "Privilege escalation in Python subprocess module",
    description:
      "A privilege escalation vulnerability in Python's subprocess module could allow local attackers to gain elevated privileges.",
    affected: [
      { package: "python3", version: "3.8.10", path: "/usr/bin/python3" },
      { package: "python3-dev", version: "3.8.2-0", path: "/usr/include/python3.8/" },
    ],
    remediation: "Update Python to version 3.9.16 or 3.10.8, review subprocess usage.",
    publishedAt: "2024-01-08",
    updatedAt: "2024-01-15",
    references: [{ title: "Python Security", url: "https://python.org/news/security/" }],
    tags: ["Privilege Escalation", "subprocess"],
  },
]

const CVEList: React.FC = () => {
  const [selectedCVEs] = useState<CVE[]>(mockCVEs)

  const layout = [
    { i: "header", x: 0, y: 0, w: 12, h: 1.5, maxH: 1.5, minH: 1.5 },
    { i: "issues-master", x: 0, y: 1, w: 8, h: 2 },
    { i: "severity", x: 8, y: 1, w: 4, h: 2 },
    { i: "issues", x: 0, y: 3, w: 12, h: 3.5, maxH: 4.5, minH: 3.5 },
  ]

  const severityCounts = {
    Critical: selectedCVEs.filter((cve) => cve.severity.level === "Critical").length,
    Attention: selectedCVEs.filter((cve) => cve.severity.level === "Attention").length,
    Interest: selectedCVEs.filter((cve) => cve.severity.level === "Interest").length,
  }

  const totalVulnerabilities = selectedCVEs.length
  const totalDependencies = new Set(selectedCVEs.map((cve) => cve.package)).size

  return (
    <div className="cve-list-container">
      <Sidebar />
      <div className="cve-list-main-content">
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          isDraggable={false}
          isResizable={true}
        >
          <div key="header" className="card">
            <div className="card-title">업로드 날짜 · 최신 SBOM 파일명</div>
            <div className="cve-list-header">2024-01-25 · production-sbom-v2.1.json</div>
          </div>

          <div key="issues-master" className="card">
            <div className="card-title">ISSUES MASTER</div>
            <div className="issues-master">
              <div className="issues-master-row">
                <span className="label">Vulnerabilities:</span>
                <span className="count">{totalVulnerabilities}</span>
              </div>
              <div className="issues-master-row">
                <span className="label">Dependencies:</span>
                <span className="count">{totalDependencies}</span>
              </div>
            </div>
          </div>

          <div key="severity" className="card">
            <div className="card-title">Severity</div>
            <div className="severity-list">
              <div className="severity-item">
                <div className="status-critical"></div>
                <span>Critical: {severityCounts.Critical}</span>
              </div>
              <div className="severity-item">
                <div className="status-attention"></div>
                <span>Attention: {severityCounts.Attention}</span>
              </div>
              <div className="severity-item">
                <div className="status-interest"></div>
                <span>Interest: {severityCounts.Interest}</span>
              </div>
            </div>
          </div>

          <div key="issues" className="card">
            <div className="card-title">ISSUES</div>
            <div className="issues-table">
              <div className="issues-header">
                <div className="issues-cell">CVE</div>
                <div className="issues-cell">Package/Component</div>
                <div className="issues-cell">Severity</div>
                <div className="issues-cell">Summary</div>
              </div>
              {selectedCVEs.map((cve) => (
                <Link key={cve.cveId} to={`/policy/cve/${cve.cveId}`} className="issues-row">
                  <div className="issues-cell">{cve.cveId}</div>
                  <div className="issues-cell">{cve.package}</div>
                  <div className="issues-cell">
                    <div className={`status-${cve.severity.level.toLowerCase()}`}></div>
                    <span>{cve.severity.level}</span>
                  </div>
                  <div className="issues-cell">{cve.summary}</div>
                </Link>
              ))}
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </div>
  )
}

export default CVEList
