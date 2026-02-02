import { NextResponse } from "next/server";

export interface ApiError {
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

type OkOptions = {
  status?: number;
};

type FailOptions = {
  status?: number;
};

export function ok<T>(data: T, options: OkOptions = {}) {
  const { status = 200 } = options;
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  );
}

export function fail(
  error: string,
  options: FailOptions = {},
): NextResponse<ApiResponse<never>> {
  const { status = 400 } = options;
  return NextResponse.json(
    {
      success: false,
      error: { message: error },
    },
    { status },
  );
}
