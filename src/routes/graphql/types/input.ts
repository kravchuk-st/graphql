export interface CreateProfileInputType {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
  };
}

export interface ChangeProfileInputType {
  id: string;
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
}

export interface CreatePostInputType {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
}

export interface ChangePostInputType {
  id: string;
  dto: {
    title: string;
    content: string;
  };
}

export interface CreateUserInputType {
  dto: {
    name: string;
    balance: number;
  };
}

export interface ChangeUserInputType {
  id: string;
  dto: {
    name: string;
    balance: number;
  };
}
