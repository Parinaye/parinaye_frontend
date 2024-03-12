import React, { useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../shadcn/components/ui/pagination";
import { Card } from "../shadcn/components/ui/card";

export default function MyPagination({
  setCurrentPage,
  currentPage,
  profiles,
  recordsPerPage,
}) {
  const nPages = Math.ceil(profiles.length / recordsPerPage);
  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  return (
    <Card>
      <Pagination>
        <PaginationContent>
          <PaginationItem disabled={currentPage === 1}>
            <PaginationPrevious onClick={goToPrevPage} />
          </PaginationItem>
          {currentPage != 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {[...Array(nPages).keys()]
            .slice(currentPage - 1, currentPage + 1)
            .map((i) => (
              <PaginationItem>
                <PaginationLink
                  key={"key_" + (i + 1)}
                  id={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage == i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          {currentPage != nPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem disabled={currentPage === 1}>
            <PaginationNext onClick={goToNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Card>
  );
}
