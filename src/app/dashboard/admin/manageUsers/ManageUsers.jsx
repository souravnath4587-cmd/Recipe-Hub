"use client";

import React, { useState } from "react";
import { Card, Table, Avatar, Button, Chip, Input } from "@heroui/react";
import {
  FiSearch,
  FiShield,
  FiUserCheck,
  FiUserX,
  FiUsers,
} from "react-icons/fi";
import Image from "next/image";
import { userStatusUpdate } from "@/app/lib/action/users";
import { toast } from "react-toastify";
import { filter } from "framer-motion/client";

export default function ManageUsersPage({ allUsers }) {
  const [users, setUsers] = useState(allUsers);
  const [searchQuery, setSearchQuery] = useState("");

  // Handler toggling block state dynamically
  const handleBlockUser = async (userId, name) => {
    const result = await userStatusUpdate(userId, { status: "block" });

    // If the database successfully acknowledged the modification update
    if (result.acknowledged || result.modifiedCount > 0) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          // FIX: Match against database key (_id) and return a clean shallow copy object
          user._id === userId ? { ...user, status: "block" } : user,
        ),
      );
    }
    if (result.modifiedCount > 0) {
      toast.success(`${name} is blocked..`);
    } else {
      toast.error(error.message);
    }
  };

  const handleUnblockUser = async (userId, name) => {
    const result = await userStatusUpdate(userId, { status: "active" });

    // If the database successfully acknowledged the modification update
    if (result.acknowledged || result.modifiedCount > 0) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          // FIX: Match against database key (_id) and return a clean shallow copy object
          user._id === userId ? { ...user, status: "active" } : user,
        ),
      );
    }
    if (result.modifiedCount > 0) {
      toast.success(`${name} is active..`);
    } else {
      toast.error(error.message);
    }
  };

  // Filter pipeline for dynamic rendering
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  console.log(searchQuery);

  return (
    <div className="max-w-5xl md:w-7xl mx-auto p-6 space-y-6 text-foreground min-h-screen bg-background">
      {/* Top Controls Banner Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-divider">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <FiUsers className="text-primary" /> Manage Users
          </h1>
          <p className="text-default-500 text-sm">
            Review registration history logs, track community standard
            indicators, and manage system blocklists.
          </p>
        </div>

        {/* Input Component matching Light/Dark layout standard */}
        <Input
          isClearable
          className="w-full md:max-w-xs"
          placeholder="Search by name or email..."
          startContent={<FiSearch className="text-default-400" />}
          // value={searchQuery}
          onValueChange={(e) => setSearchQuery(e.value)}
          variant="flat"
        />
      </div>

      {/* Main Container Wrapper */}
      <Card className="bg-content1 border border-divider rounded-2xl p-4 shadow-sm">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Administrative system user management table data summary">
              <Table.Header>
                {/* Primary row descriptor targeting screen reader parsing layouts */}
                <Table.Column
                  isRowHeader
                  className="bg-default-100 text-default-700 font-bold"
                >
                  USER
                </Table.Column>
                <Table.Column className="bg-default-100 text-default-700 font-bold">
                  Role
                </Table.Column>
                <Table.Column className="bg-default-100 text-default-700 font-bold">
                  REGISTRATION DATE
                </Table.Column>
                <Table.Column className="bg-default-100 text-default-700 font-bold">
                  STATUS
                </Table.Column>
                <Table.Column className="bg-default-100 text-default-700 font-bold text-center">
                  ACTIONS
                </Table.Column>
              </Table.Header>

              <Table.Body
                emptyContent={
                  "No user matching that sequence sequence discovered."
                }
              >
                {filteredUsers.map((user) => (
                  <Table.Row
                    key={user.id}
                    className="border-b border-divider/50 last:border-none hover:bg-default-50/50 transition-colors"
                  >
                    {/* User Identity Column Grouping */}
                    <Table.Cell>
                      <div className="flex items-center gap-3 py-1">
                        <Image
                          src={user?.image}
                          //   color={user.isBlocked ? "danger" : "default"}
                          className="rounded-full"
                          alt={user?.name}
                          width={60}
                          height={60}
                        ></Image>
                        {/* <Avatar
                          isBordered
                          color={user.isBlocked ? "danger" : "default"}
                          size="md"
                          src={user.image}
                          name={user.name}
                        /> */}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold tracking-tight text-foreground capitalize">
                            {user.name}
                          </span>
                          <span className="text-xs text-default-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </Table.Cell>

                    {/* Registration Date String Column */}
                    <Table.Cell className="text-sm text-default-600 capitalize">
                      {user.role}
                    </Table.Cell>
                    {/* Registration Date String Column */}
                    <Table.Cell className="text-sm text-default-600">
                      {new Date(user.createdAt).toLocaleString()}
                    </Table.Cell>

                    {/* Badge Status Chip Flag indicator */}
                    <Table.Cell>
                      <Chip
                        size="sm"
                        variant="soft"
                        color={user.isBlocked ? "danger" : "success"}
                        className="font-bold text-xs"
                      >
                        {user.status}
                      </Chip>
                    </Table.Cell>

                    {/* Operations Controls Buttons Action Panel */}
                    <Table.Cell>
                      <div className="flex items-center justify-center gap-2">
                        {user.status === "block" ? (
                          <Button
                            size="sm"
                            variant="flat"
                            color="success"
                            className="font-semibold text-xs"
                            startContent={<FiUserCheck size={14} />}
                            onPress={() =>
                              handleUnblockUser(user._id, user.name)
                            }
                          >
                            Unblock User
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            className="font-semibold text-xs"
                            startContent={<FiUserX size={14} />}
                            onPress={() =>
                              handleBlockUser(user._id, user?.name)
                            }
                          >
                            Block User
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
          <Table.Footer className="text-xs text-default-400 p-2 border-t border-divider/50">
            Showing {filteredUsers.length} total recorded accounts
          </Table.Footer>
        </Table>
      </Card>
    </div>
  );
}
