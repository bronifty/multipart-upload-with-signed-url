import React, { useEffect, useState } from "react";
import { listBuckets } from "./script"; // Adjust the import path as necessary

const BucketList = () => {
  const [buckets, setBuckets] = useState([]);

  useEffect(() => {
    const fetchBuckets = async () => {
      const buckets = await listBuckets();
      setBuckets(buckets);
    };
    fetchBuckets();
  }, []);

  return (
    <div id="bucketGrid">
      {buckets.map((bucket) => (
        <div className="bucket-cell" key={bucket.Name}>
          <strong>Bucket Name:</strong> {bucket.Name}
          <strong>Creation Date:</strong>{" "}
          {new Date(bucket.CreationDate).toLocaleDateString()}
        </div>
      ))}
    </div>
  );
};

export default BucketList;
