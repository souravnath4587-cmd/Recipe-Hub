"use client";

import React, { useState } from "react";
import { Table, Chip, Button } from "@heroui/react";
import {
  FiAlertOctagon,
  FiCheckCircle,
  FiTrash2,
  FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";
import { reportDelete } from "@/app/lib/action/recipe";
import { toast } from "react-toastify";

export default function ReportsDashboard({ allReports = [] }) {
  const [reports, setReports] = useState(allReports);

  // Optional: Function to handle changing report status or deleting them
  const handleResolveReport = async (reportId) => {
    const confirmResolve = confirm("Mark this report as resolved?");
    if (!confirmResolve) return;

    // Optimistically update or filter out the resolved report from the UI array list
    setReports((prev) => prev.filter((report) => report._id !== reportId));
  };

  const handleDeleteReports = async (reportId) => {
    const confirmResolve = confirm("Are you sure to delete this report?");
    if (!confirmResolve) return;
    const deleteData = await reportDelete(reportId);
    if (deleteData.deletedCount > 0) {
      toast.success(`${reportId} is successfully delete from the server.`);
    }
  };

  // Helper function to color-code your 3 specific reasons
  const getReasonColor = (reason) => {
    switch (reason) {
      case "Copyright Issue":
        return "danger";
      case "Offensive Content":
        return "warning";
      case "Spam":
        return "default";
      default:
        return "primary";
    }
  };

  return (
    <div className="max-w-5xl md:w-7xl mx-auto p-6 space-y-6">
      {/* Title Header Section */}
      <div className="border-b border-divider pb-4">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-foreground">
          <FiAlertOctagon className="text-danger" /> Content Moderation Pipeline
        </h1>
        <p className="text-xs text-default-400 font-medium mt-1">
          Review user-submitted safety flags, copyright violations, and spam
          notifications.
        </p>
      </div>

      {/* HeroUI v3.2.1 Core Compound Table Architecture Implementation */}
      <Table aria-label="System Reports Master Audit Log Table">
        <Table.ScrollContainer>
          <Table.Content>
            <Table.Header>
              <Table.Column>Target Recipe ID</Table.Column>
              <Table.Column>Reporter User</Table.Column>
              <Table.Column>Violation Reason</Table.Column>
              <Table.Column>Context Details</Table.Column>
              <Table.Column>Submission Date</Table.Column>
              <Table.Column>Workflow Status</Table.Column>
              <Table.Column>Actions</Table.Column>
            </Table.Header>

            <Table.Body
              emptyContent={
                "No pending report documents found in moderation queue."
              }
            >
              {reports.map((report) => (
                <Table.Row
                  key={report._id}
                  className="border-b border-divider/40"
                >
                  {/* Recipe ID Linked Trigger */}
                  <Table.Cell>
                    <Link
                      href={`/recipes/${report.recipeId}`}
                      className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      {report.recipeId.substring(0, 8)}...
                      <FiExternalLink size={10} />
                    </Link>
                  </Table.Cell>

                  {/* Reporter User ID */}
                  <Table.Cell>
                    <span className="text-xs font-mono text-default-600">
                      {report.userId.substring(0, 8)}...
                    </span>
                  </Table.Cell>

                  {/* Reason Custom Chip Badge */}
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getReasonColor(report.reason)}
                      className="font-bold tracking-wide text-[11px]"
                    >
                      {report.reason}
                    </Chip>
                  </Table.Cell>

                  {/* Context Text Block Limited Width */}
                  <Table.Cell>
                    <div className="max-w-[280] text-xs text-default-500 line-clamp-2 leading-relaxed">
                      {report.details}
                    </div>
                  </Table.Cell>

                  {/* Formatted Creation Date */}
                  <Table.Cell>
                    <span className="text-xs text-default-400 font-medium">
                      {new Date(report.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </Table.Cell>

                  {/* Status Indicator */}
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="dot"
                      color="warning"
                      className="font-semibold text-xs"
                    >
                      {report.status}
                    </Chip>
                  </Table.Cell>

                  {/* Admin Row Action Controls */}
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="success"
                        radius="md"
                        title="Mark Resolved"
                        onPress={() => handleResolveReport(report._id)}
                      >
                        <FiCheckCircle size={14} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="danger"
                        radius="md"
                        title="Dismiss / Delete Report"
                        onPress={() => handleDeleteReports(report._id)}
                      >
                        <FiTrash2 size={14} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        {/* Dynamic Footer Monitoring Log */}
        <Table.Footer>
          <div className="p-3 flex justify-between items-center text-xs text-default-400 font-mono">
            <span>
              Queue Backlog: {reports.length} pending moderation items mapped
            </span>
            <span>Security Clearance: Tier-1 Admin Terminal</span>
          </div>
        </Table.Footer>
      </Table>
    </div>
  );
}
