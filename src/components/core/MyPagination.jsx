import React, { useEffect, useState } from "react";
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
  currentPage,
  recordsPerPage,
  totalProfiles,
  handleProfilesPagination,
}) {


  
  const nPages = Math.ceil(totalProfiles / recordsPerPage);
  const goToNextPage = () => {
    if (currentPage !== nPages) {
      handleProfilesPagination(currentPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) {
      handleProfilesPagination(currentPage - 1);
    }
  };
  return (
    <Card className="flex flex-col items-center">
      <p className="text-2sm text-muted-foreground">Showing ({recordsPerPage * (currentPage - 1) + 1} - {recordsPerPage * (currentPage - 1) + (nPages == currentPage ? totalProfiles%recordsPerPage : 9)}) out of {totalProfiles}</p>
      <Pagination>
        <PaginationContent>
          <PaginationItem disabled={currentPage === 1}>
            <PaginationPrevious onClick={goToPrevPage} />
          </PaginationItem>
          {currentPage - 1 != 0 && (
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
                  onClick={() => {
                    handleProfilesPagination(i + 1);
                  }}
                  isActive={currentPage == i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          {currentPage != nPages && currentPage + 1 != nPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem disabled={currentPage === (nPages) }>
            <PaginationNext onClick={goToNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Card>
  );
}
