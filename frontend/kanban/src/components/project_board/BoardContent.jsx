import { FaCheck, FaPen } from "react-icons/fa6";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { PiTimerLight } from "react-icons/pi";
import { IoMdAdd } from "react-icons/io";

export default function BoardContent({
    isEditingProjectName,
    projectName,
    handleProjectNameChange,
    handleProjectNameKeyDown,
    handleUpdateProjectName,
    setIsEditingProjectName,
    filterOptions,
    activeFilter,
    setActiveFilter,
    columns,
    cards,
    handleSetShowCardInfo,
    handleAddCard,
    handleAddColumn,
    projectid,
}) {
    return (
        <section className="max-w-[1400px] mx-auto space-y-6">
            {/* Project Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isEditingProjectName ? (
                        <div className="flex items-center gap-2">
                            <input
                                className="text-2xl font-semibold text-gray-800 border-b border-gray-400 focus:outline-none focus:border-violet-600"
                                value={projectName}
                                onChange={handleProjectNameChange}
                                onKeyDown={handleProjectNameKeyDown}
                                autoFocus
                            />
                            <button
                                className="text-violet-600 hover:text-violet-800 transition"
                                onClick={handleUpdateProjectName}
                            >
                                <FaCheck size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-semibold text-gray-800">{projectName}</h2>
                            <button
                                className="text-gray-400 hover:text-violet-600 transition"
                                onClick={() => setIsEditingProjectName(true)}
                            >
                                <FaPen size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters and view toggles */}
                <div className="flex items-center gap-4">
                    <div className="flex gap-1 bg-gray-50 p-1 border border-gray-200">
                        {filterOptions.map((option) => (
                            <button
                                key={option}
                                className={`px-3 py-1 text-xs font-medium transition ${activeFilter === option
                                    ? "bg-violet-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                onClick={() => setActiveFilter(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button className="p-1 text-gray-400 hover:text-violet-600">
                            <CiGrid2H size={20} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-violet-600">
                            <CiGrid41 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Info */}
            <div className="p-3 bg-white border border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                    Showing tasks for:{" "}
                    <span className="font-medium text-gray-800">{activeFilter}</span>
                </p>
            </div>

            {/* Columns and Cards */}
            <div className="flex gap-3 overflow-x-auto bg-cover bg-no-repeat">
                {columns &&
                    columns.map((column) => (
                        <div
                            key={column.id}
                            className="bg-white border border-gray-300 w-72 p-2 h-min"
                        >
                            <div className="flex items-center py-2 gap-2">
                                <h2 className="text-lg font-semibold text-gray-800 text-center">
                                    {column.name}
                                </h2>
                                <h2 className="bg-gray-300 rounded-full w-[24px] text-center font-light">
                                    {cards.filter((card) => card.column === column.id).length}
                                </h2>
                            </div>

                            <div className="flex flex-col gap-2">
                                {cards
                                    .filter((card) => card.column === column.id)
                                    .map((card) => (
                                        <div
                                            onClick={() => handleSetShowCardInfo(card.id)}
                                            key={card.id}
                                            className="p-3 bg-gray-50 border border-gray-200 hover:border-gray-300 cursor-pointer"
                                        >
                                            <p className="text-sm font-medium text-gray-800 mb-1">{card.name}</p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <PiTimerLight size={12} className="mr-1" />
                                                <span>{new Date(card.due_date + 'T12:00:00').toLocaleDateString()}</span>
                                                <div className="flex items-center gap-1 ml-auto">
                                                    <HiMiniPencilSquare size={12} className="text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                <button
                                    className="text-sm text-black hover:text-cyan-700 hover:bg-gray-100 py-2 cursor-pointer"
                                    onClick={() => handleAddCard(column.id)}
                                >
                                    + Add new Card
                                </button>
                            </div>
                        </div>
                    ))}

                <button
                    className="bg-white border border-gray-300 w-72 p-4 h-15 flex items-center gap-2 cursor-pointer opacity-85"
                    onClick={() => handleAddColumn(projectid)}
                >
                    <IoMdAdd />
                    <h2>Add new column</h2>
                </button>
            </div>
        </section>
    );
}
