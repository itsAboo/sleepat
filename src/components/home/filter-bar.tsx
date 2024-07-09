"use client";

import { useSearchParams, useRouter } from "next/navigation";
import AddressPicker from "./address-picker";
import CategoryPicker from "./category-picker";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, value: string) => {
    const currentSearch = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    if (value) {
      currentSearch.set(key, value);
    } else {
      currentSearch.delete(key);
    }
   
    const search = currentSearch.toString();
    const query = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${query}`);
  };
  return (
    <div className="flex lg:flex-row flex-col gap-4 justify-around items-center my-5">
      <CategoryPicker onSearch={handleFilter} className="w-full" />
      <AddressPicker onSearch={handleFilter} className="lg:w-1/2 w-full" />
    </div>
  );
}
