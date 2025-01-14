import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { IUser } from "../../../interfaces";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRankingUsers } from "../../../services/userService";
import Spinner from "../../../components/reusable/Spinner";
import { useNavigate } from "react-router-dom";

const tableColumns = [
  "Miejsce",
  "Użytkownik",
  "Stworzone Quizy",
  "Ukończone Quizy",
  "Ocenione Quizy",
  "Punkty",
];

export const RankingTable = ({
  query,
  sortBy,
}: {
  query: string;
  sortBy: string;
}) => {
  const [page, setPage] = useState<number>(0);
  const navigate = useNavigate();
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ranking", query, page, sortBy],
    queryFn: () => fetchRankingUsers(query, page + 1, sortBy),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
    refetch();
  };

  const navigateToUser = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  if (isLoading)
    return (
      <div className="flex h-[85%] w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="mx-4 flex flex-col justify-between 2xl:h-[87.7%]">
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          flexGrow: 1,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-base)",
              }}
            >
              {tableColumns.map((value) => (
                <TableCell
                  sx={{ color: "var(--color-text-base)", border: "none" }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.users.map((user: IUser, index: number) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 && "var(--color-primary)",
                }}
              >
                <TableCell
                  sx={{
                    color: "var(--color-text-base)",
                    border: "none",
                  }}
                >
                  {index + 1 + page * 10}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--color-text-base)",
                    border: "none",
                    display: "flex",
                    gap: "4px",
                    minWidth: "250px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <img
                    className="h-5 w-5 cursor-pointer rounded-full"
                    onClick={() => navigateToUser(user._id)}
                    src={user.profilePicture}
                  />
                  <span
                    className="cursor-pointer truncate"
                    onClick={() => navigateToUser(user._id)}
                  >
                    {user?.nickname}
                  </span>
                </TableCell>
                <TableCell
                  sx={{ color: "var(--color-text-base)", border: "none" }}
                >
                  {user?.createdQuizzes}
                </TableCell>
                <TableCell
                  sx={{ color: "var(--color-text-base)", border: "none" }}
                >
                  {user?.finishedQuizzes}
                </TableCell>
                <TableCell
                  sx={{ color: "var(--color-text-base)", border: "none" }}
                >
                  {user?.likedQuizzes}
                </TableCell>
                <TableCell
                  sx={{ color: "var(--color-text-base)", border: "none" }}
                >
                  {user?.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage={false}
        sx={{
          color: "var(--color-text-base)",
          border: "none",
        }}
        rowsPerPage={10}
        component="div"
        count={users.allUsersCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
      />
    </div>
  );
};
