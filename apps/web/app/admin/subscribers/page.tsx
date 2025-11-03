"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { IUser, SubscriptionStatus } from "@/types/models";

export default function AdminSubscribersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus && { status: filterStatus }),
      });

      const response = await fetch(`/api/admin/subscribers?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case SubscriptionStatus.CANCELED:
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case SubscriptionStatus.EXPIRED:
        return "bg-red-500/20 text-red-700 dark:text-red-400";
      case SubscriptionStatus.TRIAL:
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Subscribers</h2>
          <p className="text-gray-600 dark:text-gray-400">View and manage user subscriptions</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Statuses</SelectItem>
                <SelectItem value={SubscriptionStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={SubscriptionStatus.CANCELED}>Canceled</SelectItem>
                <SelectItem value={SubscriptionStatus.EXPIRED}>Expired</SelectItem>
                <SelectItem value={SubscriptionStatus.TRIAL}>Trial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Card>
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Tier</th>
                      <th className="p-4 font-medium">Joined</th>
                      <th className="p-4 font-medium">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4 font-medium">{user.email}</td>
                        <td className="p-4">{user.name || "—"}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(user.subscriptionStatus)}>
                            {user.subscriptionStatus}
                          </Badge>
                        </td>
                        <td className="p-4 capitalize">{user.subscriptionTier}</td>
                        <td className="p-4">{formatDate(user.createdAt)}</td>
                        <td className="p-4">{formatDate(user.lastExerciseDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">No subscribers found</div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
