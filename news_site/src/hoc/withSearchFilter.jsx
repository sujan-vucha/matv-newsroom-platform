
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "../context/SearchContext";

const withSearchFilter = (WrappedComponent, apiPath) => {
  const Wrapper = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchQuery } = useSearch();

    useEffect(() => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${apiPath}`)
        .then((res) => setItems(res.data || []))
        .catch((err) => console.error(`❌ Error loading ${apiPath}`, err))
        .finally(() => setLoading(false));
    }, []);

    const filteredItems = items.filter((item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
      return <div className="text-center p-10 text-gray-500">Loading...</div>;
    }

    return <WrappedComponent data={filteredItems || []} />;
  };

  return Wrapper;
};

export default withSearchFilter;
