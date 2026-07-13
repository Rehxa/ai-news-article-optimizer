// "use client";
// import { CustomDialog } from "@/pages/components/custom_dialog.jsx";
// import SideBarGlobal from "@/pages/components/side_bar_global.jsx";
// import ArticleCard from "../components/article_card";
// import AddNewCard from "../components/add_new_card";
// import { getAllMockArticles } from "@/lib/data/mocks/mockArticles";
// import Pagination from "@/pages/my_article/components/pagination";

// import { useState, useEffect, useMemo, useRef } from "react";
// export default function MyArticlePage() {
//   //State
//   const [mode, setMode] = useState("my_article");
//   // const [mode, setMode] = useState("recycle_bin");
//   //UI
//   const [isSelectionState, setIsSelectionState] = useState(false);
//   const timerRef = useRef(null);

//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [showDeleteAllPopup, setShowDeleteAllPopup] = useState(false);
//   const [showRestorePopup, setShowRestorePopup] = useState(false);
//   const [showRestoreAllPopup, setShowRestoreAllPopup] = useState(false);
//   const [showAlertPopup, setShowAlertPopup] = useState(false);

//   const [loading, setLoading] = useState(false);

//   //Data
//   //My Article
//   const [allArticles, setAllArticles] = useState([]);
//   const [selectedIds, setSelectedIds] = useState(new Set());

//   //Use Effect
//   // const articles = useMemo(() => getAllMockArticles(), []);

//   // useEffect(() => {
//   //   setAllArticles(articles);
//   // }, [articles]);

//   const userId = "user_001";

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/articles?userId=${userId}`);
//         const data = await res.json();
//         setAllArticles(data);
//         console.log(allArticles);
//         console.log(typeof allArticles);
//         console.log(Array.isArray(allArticles));
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, [userId]);

//   //buttons
//   const handleSelection = (item) => {
//     if (!isSelectionState) {
//       console.log("Pressed open article");
//       // return;
//     }

//     if (!isSelectionState) {
//       timerRef.current = setTimeout(() => {
//         console.log("Long Press!");
//         setIsSelectionState(true);
//         setSelectedIds((prev) => {
//           const next = new Set(prev);
//           next.add(item.id);
//           return next;
//         });
//         console.log(item.id);
//         console.log(selectedIds);
//       }, 600);
//     } else {
//       setSelectedIds((prev) => {
//         const next = new Set(prev);
//         if (prev.has(item.id)) {
//           next.delete(item.id);
//         } else {
//           next.add(item.id);
//         }
//         return next;
//       });
//       console.log(item.id);
//       console.log(selectedIds);
//     }
//   };

//   const cancelLongPress = () => {
//     console.log("Released");

//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//       timerRef.current = null;
//       selectedIds;
//     }
//   };

//   const selectionToggle = () => {
//     if (isSelectionState) {
//       setSelectedIds(new Set());
//       setIsSelectionState(false);
//     } else {
//       setIsSelectionState(true);
//     }
//   };

//   return (
//     <div className="bg-natural-white w-screen h-screen flex justify-between items-center">
//       {/* Side Bar */}
//       <SideBarGlobal />
//       <div className="w-full h-screen flex flex-col justify-start p-5 gap-5 bg-natural-grey-blue">
//         {/* Title */}
//         <h1 className="font-bold text-5xl">
//           {mode == "my_article" ? " My Article" : "Recycle Bin"}
//         </h1>
//         {/* Divider */}
//         <div className="h-0.5 w-full bg-primary-blue rounded-full" />
//         {/* Search */}
//         <div className="flex flex-row justify-between items-center">
//           <form
//             // action="/search"
//             // method="GET"
//             className="relative flex flex-row justify-between items-center h-10 w-100 bg-natural-white rounded-2xl px-6 py-4  shadow-md"
//           >
//             <div className="flex flex-row justify-start grow">
//               <button className="material-symbols-outlined text-primary-blue">
//                 search
//               </button>
//               <input
//                 type="search"
//                 name="search-input"
//                 placeholder="Search articles..."
//                 className="w-full pl-4 pr-4 py-2 bg-white rounded-lg outline-none text-sm grow"
//               />
//             </div>
//             <button className="material-symbols-outlined text-primary-blue">
//               swap_vert
//             </button>{" "}
//             <button className="material-symbols-outlined text-primary-blue">
//               filter_list
//             </button>
//           </form>
//           {/* Selection */}
//           <ButtonGroup
//             isSelectionState={isSelectionState}
//             mode={mode}
//             selectedIds={selectedIds}
//             selectionToggle={selectionToggle}
//             onDelete={() => {
//               if (selectedIds.size == 0) {
//                 setShowAlertPopup(!showAlertPopup);
//               } else {
//                 setShowDeletePopup(!showDeletePopup);
//               }
//             }}
//             onDeleteAll={() => setShowDeleteAllPopup(!showDeleteAllPopup)}
//             onRestoreAll={() => setShowRestoreAllPopup(!showRestoreAllPopup)}
//             onRestore={() => {
//               if (selectedIds.size == 0) {
//                 setShowAlertPopup(!showAlertPopup);
//               } else {
//                 setShowRestorePopup(!showRestorePopup);
//               }
//             }}
//           />
//         </div>

//         {/* Article Cards */}
//         {/* <div className="grid grid-cols-5 grid-rows-3 gap-2"> */}

//         <div className="grid grid-cols-[repeat(auto-fill,minmax(196px,1fr))] justify-center place-items-center gap-4 overflow-auto no-scrollbar">
//           {/* tobe add */}
//           <AddNewCard onClick={() => {}} />
//           {/* <div className="flex flex-wrap gap-4 w-fit "> */}
//           {allArticles.map((a, index) => (
//             <ArticleCard
//               key={index}
//               title={a.title}
//               description={a.description}
//               updatedAt={a.updatedAt}
//               onLongPressed={() => handleSelection(a)}
//               cancelLongPressed={cancelLongPress}
//               isSelected={selectedIds.has(a.id)}
//               isSelectionState={isSelectionState}
//               mode={mode}
//               deletedAt={a.deletedAt}
//             />
//           ))}
//         </div>
//         <div className="w-full bg-natural-grey-blue mt-auto">
//           {/* <p>pagination</p> */}
//           <Pagination />
//         </div>
//       </div>

//       <CustomDialog
//         title="Delete all articles"
//         message="Are you sure you still want to delete all items in the recycle bin?"
//         isDelete={true}
//         icon={
//           <img
//             src="/assets/Inbox-cleanup-rafiki.svg"
//             alt="Inbox-cleanup"
//             className="w-[85%]"
//           />
//         }
//         isOpen={showDeleteAllPopup}
//         onConfirm={() => {
//           setShowDeleteAllPopup(false);
//         }}
//         onCancel={() => setShowDeleteAllPopup(false)}
//       />

//       <CustomDialog
//         title="Delete articles"
//         message={`Are you sure you want to delete ${selectedIds.size} selected items?`}
//         isDelete={true}
//         icon={
//           <img
//             src="/assets/Inbox-cleanup-rafiki.svg"
//             alt="Inbox-cleanup"
//             className="w-[85%]"
//           />
//         }
//         isOpen={showDeletePopup}
//         onConfirm={() => {
//           setShowDeletePopup(false);
//         }}
//         onCancel={() => setShowDeletePopup(false)}
//       />

//       <CustomDialog
//         title="Recover all articles"
//         message="Are you sure you want to recover  all items from the recycle bin?"
//         isDelete={false}
//         icon={
//           <img
//             src="/assets/Folder-rafiki.svg"
//             alt="folder"
//             className="w-[85%]"
//           />
//         }
//         isOpen={showRestoreAllPopup}
//         onConfirm={() => {
//           setShowRestoreAllPopup(false);
//         }}
//         onCancel={() => setShowRestoreAllPopup(false)}
//       />

//       <CustomDialog
//         title="Recover articles"
//         message={`Are you sure you want to delete ${selectedIds.size} selected items?`}
//         isDelete={false}
//         icon={
//           <img
//             src="/assets/Folder-rafiki.svg"
//             alt="folder"
//             className="w-[85%]"
//           />
//           // <div className="material-symbols-rounded text-accent-red !text-7xl !mb-0">
//           //   delete
//           // </div>
//         }
//         isOpen={showRestorePopup}
//         onConfirm={() => {
//           setShowRestorePopup(false);
//         }}
//         onCancel={() => setShowRestorePopup(false)}
//       />

//       <CustomDialog
//         title="Reminder"
//         message="Please select one of the articles!"
//         isDelete={false}
//         icon={
//           <img
//             src="/assets/Publish-article-amico.svg"
//             alt="Reminder"
//             className="w-[85%]"
//           />
//           // <div className="material-symbols-rounded text-accent-red !text-7xl !mb-0">
//           //   delete
//           // </div>
//         }
//         isOpen={showAlertPopup}
//         onConfirm={() => {
//           setShowAlertPopup(false);
//         }}
//         onCancel={() => setShowAlertPopup(false)}
//       />
//     </div>
//   );
// }

// function ButtonGroup({
//   isSelectionState,
//   mode,
//   selectedIds,
//   selectionToggle,
//   onDelete,
//   onDeleteAll,
//   onRestore,
//   onRestoreAll,
// }) {
//   return (
//     <div className="flex flex-row gap-4">
//       <button
//         onClick={selectionToggle}
//         className="border-1 border-primary-blue flex flex-row gap-2 items-center rounded-full h-full px-4 py-2 cursor-pointer hover:opacity-50"
//       >
//         {/* My Article */}{" "}
//         <h1 className="font-bold text-primary-blue">
//           {isSelectionState ? selectedIds.size : ""} selected
//         </h1>
//         {isSelectionState && (
//           <span className="material-symbols-rounded text-primary-blue">
//             cancel
//           </span>
//         )}
//       </button>
//       {mode == "my_article" && isSelectionState && (
//         <>
//           <ActionButton
//             color={"red"}
//             icon={"delete"}
//             label={"delete"}
//             onClick={onDelete}
//           />
//         </>
//       )}

//       {/* Recycle bin */}
//       {mode == "recycle_bin" && (
//         <>
//           <ActionButton
//             color={"blue"}
//             icon={"restore_from_trash"}
//             label={isSelectionState ? "restore" : "restore all"}
//             onClick={isSelectionState ? onRestore : onRestoreAll}
//           />
//           <ActionButton
//             color={"red"}
//             icon={"delete"}
//             label={isSelectionState ? "delete" : "delete all"}
//             onClick={isSelectionState ? onDelete : onDeleteAll}
//           />
//         </>
//       )}
//     </div>
//   );
// }

// function ActionButton({ icon, color, label, onClick }) {
//   const colorClass =
//     color === "red"
//       ? "border-accent-red text-accent-red"
//       : "border-primary-blue text-primary-blue";
//   return (
//     <button
//       className={`border-1 ${colorClass} flex flex-row gap-2 items-center rounded-full px-4 py-2 cursor-pointer hover:opacity-50`}
//       onClick={onClick}
//     >
//       <span className="material-symbols-rounded">{icon}</span>
//       <h1 className="font-bold">{label}</h1>
//     </button>
//   );
// }
