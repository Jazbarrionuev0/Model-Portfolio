import React from "react";

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col justify-center items-center md:w-48 m-5 md:m-0">
      <h3 className={`text-xl text-center`}>{title}</h3>
      <p className={`text-gray-500 text-center text-sm `}>{description}</p>
    </div>
  );
}

export default InfoCard;
