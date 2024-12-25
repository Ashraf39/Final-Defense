import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { UserData } from "@/types/user";
import { User } from "lucide-react";

interface UserManagementProps {
  onClose: () => void;
}

export const UserManagement = ({ onClose }: UserManagementProps) => {
  const { toast } = useToast();
  
  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const usersQuery = query(collection(db, "users"));
      const snapshot = await getDocs(usersQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<UserData, 'uid'>)
      }));
    },
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role: newRole
      });
      
      toast({
        title: "Role updated successfully",
        duration: 2000,
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error updating role",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl bg-gradient-to-b from-white to-gray-50">
        <DialogHeader className="space-y-4 pb-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-gray-900">Manage Users</DialogTitle>
          </div>
          <p className="text-sm text-gray-500">
            Manage user roles and permissions across the platform
          </p>
        </DialogHeader>
        
        <div className="max-h-[600px] overflow-y-auto px-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">Current Role</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium">{user.displayName || "N/A"}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'company' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};