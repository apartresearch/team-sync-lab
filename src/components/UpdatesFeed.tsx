import { useState } from "react";
import { WeeklyUpdate, User } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface UpdatesFeedProps {
  updates: WeeklyUpdate[];
  currentUser: User;
  onPostUpdate: (content: string) => void;
  onRateUpdate: (updateId: string, rating: number) => void;
}

export function UpdatesFeed({ updates, currentUser, onPostUpdate, onRateUpdate }: UpdatesFeedProps) {
  const [newUpdate, setNewUpdate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUpdate.trim()) {
      onPostUpdate(newUpdate);
      setNewUpdate("");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newUpdate}
          onChange={(e) => setNewUpdate(e.target.value)}
          placeholder="Share your weekly progress..."
          className="min-h-[100px]"
        />
        <Button type="submit">Post Update</Button>
      </form>

      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id} className="p-4 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Posted on {new Date(update.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2">{update.content}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  onClick={() => onRateUpdate(update.id, rating)}
                  className="p-2"
                >
                  <Star
                    className={`w-4 h-4 ${
                      update.ratings.some(r => r.userId === currentUser.id && r.value >= rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {update.ratings.length} ratings
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}