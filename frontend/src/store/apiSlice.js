import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Leave', 'Employee', 'Payroll'],
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => '/employees',
      providesTags: ['Employee'],
    }),
    addEmployee: builder.mutation({
      query: (employeeData) => ({
        url: '/employees',
        method: 'POST',
        body: employeeData,
      }),
      invalidatesTags: ['Employee'],
    }),
    getProfile: builder.query({
      query: () => '/employees/profile',
      providesTags: ['Employee'],
    }),
    getPayrolls: builder.query({
      query: () => '/payrolls',
      providesTags: ['Payroll'],
    }),
    createPayroll: builder.mutation({
      query: (payrollData) => ({
        url: '/payrolls',
        method: 'POST',
        body: payrollData,
      }),
      invalidatesTags: ['Payroll'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useAddEmployeeMutation,
  useGetProfileQuery,
  useGetPayrollsQuery,
  useCreatePayrollMutation,
} = apiSlice;
