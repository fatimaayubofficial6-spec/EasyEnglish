"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Power } from "lucide-react";
import { IParagraph, DifficultyLevel } from "@/types/models";

export default function AdminParagraphsPage() {
  const [paragraphs, setParagraphs] = useState<IParagraph[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedParagraph, setSelectedParagraph] = useState<IParagraph | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    difficulty: DifficultyLevel.BEGINNER,
    topics: "",
  });

  useEffect(() => {
    fetchParagraphs();
  }, [currentPage, searchTerm, filterDifficulty]);

  const fetchParagraphs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(filterDifficulty && { difficulty: filterDifficulty }),
      });

      const response = await fetch(`/api/admin/paragraphs?${params}`);
      const data = await response.json();

      if (response.ok) {
        setParagraphs(data.paragraphs);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching paragraphs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/admin/paragraphs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          topics: formData.topics.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        setIsAddDialogOpen(false);
        setFormData({ title: "", content: "", difficulty: DifficultyLevel.BEGINNER, topics: "" });
        fetchParagraphs();
      }
    } catch (error) {
      console.error("Error adding paragraph:", error);
    }
  };

  const handleEdit = async () => {
    if (!selectedParagraph) return;

    try {
      const response = await fetch(`/api/admin/paragraphs/${selectedParagraph._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          topics: formData.topics.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        setIsEditDialogOpen(false);
        setSelectedParagraph(null);
        fetchParagraphs();
      }
    } catch (error) {
      console.error("Error updating paragraph:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedParagraph) return;

    try {
      const response = await fetch(`/api/admin/paragraphs/${selectedParagraph._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedParagraph(null);
        fetchParagraphs();
      }
    } catch (error) {
      console.error("Error deleting paragraph:", error);
    }
  };

  const handleToggleActive = async (paragraph: IParagraph) => {
    try {
      const response = await fetch(`/api/admin/paragraphs/${paragraph._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !paragraph.isActive }),
      });

      if (response.ok) {
        fetchParagraphs();
      }
    } catch (error) {
      console.error("Error toggling paragraph status:", error);
    }
  };

  const openEditDialog = (paragraph: IParagraph) => {
    setSelectedParagraph(paragraph);
    setFormData({
      title: paragraph.title,
      content: paragraph.content,
      difficulty: paragraph.difficulty,
      topics: paragraph.topics.join(", "),
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (paragraph: IParagraph) => {
    setSelectedParagraph(paragraph);
    setIsDeleteDialogOpen(true);
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case DifficultyLevel.INTERMEDIATE:
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case DifficultyLevel.ADVANCED:
        return "bg-red-500/20 text-red-700 dark:text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Manage Paragraphs</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage exercise content
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Paragraph
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search paragraphs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Difficulties</SelectItem>
                <SelectItem value={DifficultyLevel.BEGINNER}>Beginner</SelectItem>
                <SelectItem value={DifficultyLevel.INTERMEDIATE}>Intermediate</SelectItem>
                <SelectItem value={DifficultyLevel.ADVANCED}>Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="space-y-4">
              {paragraphs.map((paragraph) => (
                <Card key={paragraph._id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{paragraph.title}</h3>
                        <Badge className={getDifficultyColor(paragraph.difficulty)}>
                          {paragraph.difficulty}
                        </Badge>
                        <Badge variant={paragraph.isActive ? "default" : "secondary"}>
                          {paragraph.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {paragraph.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{paragraph.wordCount} words</span>
                        {paragraph.topics.length > 0 && (
                          <span>Topics: {paragraph.topics.join(", ")}</span>
                        )}
                        <span>
                          Created: {new Date(paragraph.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(paragraph)}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(paragraph)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteDialog(paragraph)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Paragraph</DialogTitle>
              <DialogDescription>Create a new exercise paragraph</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter paragraph content"
                  rows={8}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    setFormData({ ...formData, difficulty: value as DifficultyLevel })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DifficultyLevel.BEGINNER}>Beginner</SelectItem>
                    <SelectItem value={DifficultyLevel.INTERMEDIATE}>Intermediate</SelectItem>
                    <SelectItem value={DifficultyLevel.ADVANCED}>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Topics (comma-separated)</label>
                <Input
                  value={formData.topics}
                  onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                  placeholder="e.g., technology, business, travel"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Create Paragraph</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Paragraph</DialogTitle>
              <DialogDescription>Update paragraph details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    setFormData({ ...formData, difficulty: value as DifficultyLevel })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DifficultyLevel.BEGINNER}>Beginner</SelectItem>
                    <SelectItem value={DifficultyLevel.INTERMEDIATE}>Intermediate</SelectItem>
                    <SelectItem value={DifficultyLevel.ADVANCED}>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Topics (comma-separated)</label>
                <Input
                  value={formData.topics}
                  onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Update Paragraph</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Paragraph</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this paragraph? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
