export interface Post{
    id: string;
    postText: string;
    createdAt: number | Date;
    createdBy: string;
    imageUrl?: string;
    likeCount: number;
    commentCount: number;
    viewCount: number;
}