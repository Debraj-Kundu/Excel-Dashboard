import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState, Suspense, lazy } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import formatDate from "../utils/dateFormat";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../hooks/useDebounce";
import { updateSearchKey } from "../redux/searchSlice";

const SearchBar = lazy(() => import("../components/Search/SearchBar"));

const URL = `${process.env.REACT_APP_SERVER_URL}/spreadsheet`;
const QUERY_URL = `${process.env.REACT_APP_SERVER_URL}/util`;

const TableHeaders = React.memo(() => (
  <>
    {["File", "Last Modified", "Actions"].map((item, i) => (
      <TableCell key={i}>
        <span className="text-lg font-semibold">{item}</span>
      </TableCell>
    ))}
  </>
));

const Home = () => {
  const [files, setFiles] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  const [editedFilename, setEditedFilename] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { key: searchKey } = useSelector((state) => state.searchData);
  const { user } = useSelector((state) => state.userData);
  // console.log(user)
  const [reload, setReload] = useState(false);

  const dispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (user) debouncedFetchData(searchKey);
    return () => {};
  }, [searchKey, reload]);

  useEffect(() => {
    if (!user) setFiles([]);
    return () => {};
  }, [user]);
  // const fetchData = async () => {
  //   try {
  //     const res = await axios.get(URL, { withCredentials: true });
  //     setFiles(res.data);
  //   } catch (error) {
  //     console.log(error.response.data);
  //     setErrMsg(error.response.data.message);
  //     toast.error("Something went wrong. Please try again.");
  //   }
  // };

  const debouncedFetchData = useCallback(
    useDebounce(fetchSuggestions, 300),
    []
  );

  const handleClick = (id) => {
    navigate("/view/" + id);
  };

  const deleteRow = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!isConfirmed) return;
    try {
      const res = await axios.delete(URL + "/" + id, { withCredentials: true });
      console.log(res.data);
      const newData = files.filter((item) => item.id !== id);
      setFiles(newData);
      toast.success("File deleted successfully");
    } catch (error) {
      console.log(error.response.data.message);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (id, filename) => {
    setEditingId(id);
    setEditedFilename(filename);
  };

  const handleSave = async () => {
    try {
      const payload = editedFilename.split(".");

      const res = await axios.put(
        `${URL}/${editingId}/update-name`,
        { filename: payload[0], filetype: payload[1] },
        { withCredentials: true }
      );

      dispatch(updateSearchKey(searchKey));

      setReload((prev) => !prev);

      setEditingId(null);
      setEditedFilename("");
      toast.success("Filename edited successfully!");
    } catch (error) {
      console.error("Error updating filename:", error.response.data.message);
      toast.error("Something went wrong. Please try again.");
    }
  };

  async function fetchSuggestions(query) {
    try {
      const res = await axios.get(QUERY_URL + "/search?key=" + query, {
        withCredentials: true,
      });
      setFiles(res.data);
    } catch (error) {
      console.log(error.response.data);
      setErrMsg(error.response.data.message);
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (!user) {
    return (
      <div className="mt-8 flex flex-col gap-8 items-center">
        <h3>Nothing to show :(</h3>
        <img
          loading="lazy"
          height="500px"
          width="500px"
          src={`${process.env.PUBLIC_URL}/NothingToShow.svg`}
          alt="Nothing to show"
        />
        <Link
          to="/login"
          className="rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-medium text-white shadow"
        >
          LOGIN
        </Link>
        <h3>{errMsg}</h3>{" "}
      </div>
    );
  }
  return (
    <>
      <SearchBar fetchSuggestions={fetchSuggestions} />
      {files.length > 0 ? (
        <>
          <Paper
            sx={{
              backgroundColor: "#f4f6f8",
              padding: 0,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small" aria-label="sticky table">
                <TableHead>
                  <TableHeaders />
                </TableHead>
                <TableBody>
                  {files
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, i) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={item.id}
                        >
                          <TableCell>
                            {editingId === item.id ? (
                              <div className="flex">
                                <input
                                  className="px-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={editedFilename}
                                  onChange={(e) =>
                                    setEditedFilename(e.target.value)
                                  }
                                />
                                <CheckIcon
                                  onClick={handleSave}
                                  fontSize="large"
                                  color="success"
                                  className="cursor-pointer"
                                />
                                <ClearIcon
                                  onClick={() => setEditingId(null)}
                                  fontSize="large"
                                  color="error"
                                  className="cursor-pointer"
                                />
                              </div>
                            ) : (
                              <h3
                                className="text-lg cursor-pointer hover:text-emerald-400"
                                onClick={() => handleClick(item.id)}
                              >
                                {item.filename}
                              </h3>
                            )}
                          </TableCell>
                          <TableCell>
                            <h3 className="text-lg">
                              {formatDate(item.updatedAt)}
                            </h3>
                          </TableCell>
                          <TableCell>
                            <DeleteForeverRoundedIcon
                              onClick={() => deleteRow(item.id)}
                              color="error"
                              fontSize="large"
                              className="cursor-pointer"
                            />
                            {editingId === item.id ? (
                              <ClearIcon
                                onClick={() => setEditingId(null)}
                                fontSize="large"
                                color="error"
                                className="cursor-pointer"
                              />
                            ) : (
                              <EditOutlinedIcon
                                onClick={() =>
                                  handleEdit(item.id, item.filename)
                                }
                                color="primary"
                                fontSize="large"
                                className="cursor-pointer"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={files.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      ) : (
        <>
          {searchKey.length > 0 ? (
            <>
              <h3>No search results</h3>
              <img
                loading="lazy"
                src={`${process.env.PUBLIC_URL}/NotFound.svg`}
                alt="Not found"
              />
            </>
          ) : (
            <h3>Loading ...</h3>
          )}
        </>
      )}
    </>
  );
};

export default Home;
