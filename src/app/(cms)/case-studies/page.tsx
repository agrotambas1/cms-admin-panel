"use client";

import { useState } from "react";
import { SearchFilter } from "@/components/common/filters/search-filter";
import { useServices } from "@/hooks/service/use-service";
import { useIndustries } from "@/hooks/industry/use-industry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseStudy } from "@/types/case-study/case-study";
import { useCaseStudies } from "@/hooks/case-study/use-case-study";
import { DataTable } from "@/components/common/table/data-table";
import { getCaseStudyColumns } from "./_components/case-study-columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeleteCaseStudyDialog } from "./_components/delete-case-study-dialog";
import { BulkDeleteCaseStudyDialog } from "./_components/bulk-delete-case-study-dialog";
import { canBulkDelete, canCreate, canDelete, canEdit } from "@/lib/permission";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

export default function CaseStudyPage() {
  const { role, loading: authLoading } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [serviceFilter, setServiceFilter] = useState<string | undefined>();
  const [industryFilters, setIndustryFilters] = useState<string | undefined>();

  const [deletingCaseStudy, setDeletingCaseStudy] = useState<CaseStudy | null>(
    null,
  );
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const { caseStudies, loading, pagination, refetch } = useCaseStudies({
    search: searchValue,
    status: statusFilter,
    serviceId: serviceFilter,
    industryId: industryFilters,
    page,
    limit,
  });

  const { services } = useServices({ page: 1, limit: 1000 });
  const { industries } = useIndustries({ page: 1, limit: 1000 });

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const columns = getCaseStudyColumns({
    onDelete: (caseStudy: CaseStudy) => setDeletingCaseStudy(caseStudy),
    canDelete: canDelete(role),
    canEdit: canEdit(role),
  });

  if (authLoading) return null;

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold">Case Studies</h1>

      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <div className="flex flex-col lg:flex-row gap-2 flex-1">
          <SearchFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search case studies..."
          />

          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={serviceFilter || "all"}
            onValueChange={(value) =>
              setServiceFilter(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="All Services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {services.map((solution) => (
                <SelectItem key={solution.id} value={solution.id}>
                  {solution.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={industryFilters || "all"}
            onValueChange={(value) =>
              setIndustryFilters(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="All industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id}>
                  {industry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {canCreate(role) && (
          <Button asChild>
            <Link href="/case-studies/create">
              <Plus className="h-4 w-4 mr-2" />
              New CaseStudy
            </Link>
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={caseStudies}
        loading={loading}
        emptyMessage="No case studies found"
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        getRowKey={(caseStudy) => caseStudy.id}
        enableRowSelection={canBulkDelete(role)}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onDeleteSelected={canBulkDelete(role) ? handleBulkDelete : undefined}
      />

      {deletingCaseStudy && (
        <DeleteCaseStudyDialog
          caseStudy={deletingCaseStudy}
          open={true}
          canDelete={canDelete(role)}
          onOpenChange={(open) => {
            if (!open) setDeletingCaseStudy(null);
          }}
          onDeleted={() => {
            setDeletingCaseStudy(null);
            refetch();
          }}
        />
      )}

      {bulkDeleteDialogOpen && (
        <BulkDeleteCaseStudyDialog
          selectedIds={selectedRows}
          open={true}
          onOpenChange={setBulkDeleteDialogOpen}
          onDeleted={() => {
            setSelectedRows(new Set());
            refetch();
          }}
        />
      )}
    </div>
  );
}
