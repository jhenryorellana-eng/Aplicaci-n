export interface FeedCommentItem {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export type AddCommentResult = {
  ok: boolean;
  comment?: FeedCommentItem;
  error?: string;
};
