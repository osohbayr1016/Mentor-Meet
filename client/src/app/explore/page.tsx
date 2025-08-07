"use client";

import Image from "next/image";
import Navigation from "./_components/Navigation";

const ExplorePage = () => {
  // const [currentSubCategories, setCurrentSubCategories] = useState<string[]>(
  //   []
  // );

  // const handleNavigationCategoryChange = (
  //   categoryId: number,
  //   subCategories: string[]
  // ) => {
  //   console.log("Navigation category changed:", categoryId, subCategories);
  //   setCurrentSubCategories(subCategories);
  // };

  return (
    <div className="relative w-full h-screen">
      {/* Background image */}
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="https://images.unsplash.com/photo-1724582586529-62622e50c0b3?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="background image"
        fill
        className="absolute inset-0 -z-20 object-cover"
      />

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default ExplorePage;
