import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

export const columns = [
  {name: "SALDO", uid: "saldo", sortable: true},
  {name: "VALOR", uid: "valor", sortable: true},
  {name: "TIPO", uid: "tipo"},
  {name: "DATA", uid: "dataHora", sortable: true},
  {name: "DESCRICAO", uid: "descricao"},
];

const fetcher = (...args) => {
  const token = localStorage.getItem("token");
  return fetch(...args, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};

const Extrato = () => {
  const navigate = useNavigate();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "valor",
    direction: "ascending",
  });
  const [pagina, setPagina] = useState(0);

  const { data, isLoading } = useSWR(
    `http://localhost:8080/extrato/listar?pagina=${pagina > 0 ? pagina - 1 : pagina}&itens=10`,
    fetcher,
    { keepPreviousData: true }
  );

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return data?.totalElements ? Math.ceil(data.totalElements / rowsPerPage) : 0;
  }, [data?.totalElements]);

  const loadingState =
    isLoading || data?.content?.length === 0 ? "loading" : "idle";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSortChange = (newSortDescriptor) => {
    setSortDescriptor(newSortDescriptor);
  };

  const items = useMemo(() => {
    return data?.content || [];
  }
  , [data?.content]);


  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  return (
    <>
      <Header />
      <Table
        aria-label="Tabela de extrato com ordenação do lado do cliente"
        classNames={{ table: "min-h-[400px]" }}
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="success"
                page={pagina}
                total={pages}
                onChange={setPagina}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
        
          {columns.map((column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          ))}

        </TableHeader>
        <TableBody
          items={sortedItems}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Footer />
    </>
  );
};

export default Extrato;
