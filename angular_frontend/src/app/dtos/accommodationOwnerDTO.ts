export interface AccommodationOwnerDTO {
    id: number,
    name: string,
    surname: string,
    bio: string,
    profile_picture_url: string,
    profile_picture_blob_url: Blob | string,
}