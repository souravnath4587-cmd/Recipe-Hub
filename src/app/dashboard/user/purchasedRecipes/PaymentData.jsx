"use client";

import React from "react";
import { Table, Chip, Card } from "@heroui/react";
import { FiCheckCircle, FiCalendar, FiClock, FiEye } from "react-icons/fi";
import Link from "next/link";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export default function PurchasedRecipesPage({ paymentsData }) {
  // Utility helper to render nice formatted date string lines
  const formatDate = (isoString) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-5xl md:w-7xl mx-auto px-4 py-10 space-y-6">
      {/* Informative Dashboard Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Purchased Recipes Registry
        </h1>
        <p className="text-xs text-default-400 font-medium">
          Verify and check access permissions across all individual
          transactional recipe unlocks.
        </p>
      </div>

      <Card className="border border-divider/60 shadow-sm rounded-2xl overflow-hidden bg-content1">
        <Table aria-label="Purchased recipes ledger metadata display window">
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column className="font-bold text-xs">
                  Recipe Ref Reference ID
                </Table.Column>
                <Table.Column className="font-bold text-xs">
                  Transaction ID
                </Table.Column>
                <Table.Column className="font-bold text-xs">
                  Purchaser Email
                </Table.Column>
                <Table.Column className="font-bold text-xs">
                  Unlock Date
                </Table.Column>
                <Table.Column className="font-bold text-xs">
                  Status
                </Table.Column>
                <Table.Column className="font-bold text-xs">
                  Actions
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {paymentsData.map((payment) => (
                  <Table.Row
                    key={payment._id}
                    className="border-b border-divider/40 last:border-none hover:bg-default-50/50"
                  >
                    {/* Recipe ID Cell */}
                    <Table.Cell className="font-mono text-xs text-default-500 font-medium">
                      {payment.recipeId}
                    </Table.Cell>

                    {/* Transaction Reference ID Cell */}
                    <Table.Cell className="font-semibold text-xs tracking-tight text-foreground">
                      {payment.transactionId}
                    </Table.Cell>

                    {/* User Account Email Cell */}
                    <Table.Cell className="text-xs text-default-600 font-medium">
                      {payment.userEmail}
                    </Table.Cell>

                    {/* Formatted Datetime stamp Cell */}
                    <Table.Cell className="text-xs text-default-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-default-400" />
                        <span>{formatDate(payment.paidAt)}</span>
                      </div>
                    </Table.Cell>

                    {/* Payment Status Badge Badge Component Cell */}
                    <Table.Cell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                        className="font-bold capitalize text-[10px]"
                        startContent={
                          <FiCheckCircle size={12} className="mr-0.5" />
                        }
                      >
                        {payment.paymentStatus}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        size="sm"
                        href={`/recipes/${payment.recipeId}`}
                        variant="flat"
                        color="success"
                        className="font-bold capitalize text-[10px]"
                      >
                        <FiEye size={20} />
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
          <Table.Footer />
        </Table>
      </Card>
    </div>
  );
}
