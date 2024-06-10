'use client'
import React, { useState, useEffect } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const [pages, setPages] = useState<(number | string)[]>([]);

    useEffect(() => {
        const generatePages = () => {
            const pageArray: (number | string)[] = [];
            const delta = 2; // Number of pages to show around the current page

            // Ensure first three pages are shown
            for (let i = 1; i <= Math.min(3, totalPages); i++) {
                pageArray.push(i);
            }

            // Show ellipsis if there are pages between the first three and the current range
            if (currentPage > 5) {
                pageArray.push('...');
            }

            // Add current range of pages around the current page
            for (let i = Math.max(4, currentPage - delta); i <= Math.min(currentPage + delta, totalPages - 3); i++) {
                pageArray.push(i);
            }

            // Show ellipsis if there are pages between the current range and the last three
            if (currentPage < totalPages - 4) {
                pageArray.push('...');
            }

            // Ensure last three pages are shown
            for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
                pageArray.push(i);
            }

            setPages(pageArray);
        };
        generatePages();
    }, [currentPage, totalPages]);

    return (
        <nav>
            <ul className="ebs-pagination list-inline">
                <li className={`list-inline-item page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className='ebs-prev-next'
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                </li>
                {pages.map((page, index) => (
                    <li
                        key={index}
                        className={`list-inline-item page-item ${currentPage === page ? 'active' : ''}`}
                    >
                        {typeof page === 'number' ? (
                            <button onClick={() => onPageChange(page)}>
                                {page}
                            </button>
                        ) : (
                            <span className="ellipsis">...</span>
                        )}
                    </li>
                ))}
                <li className={`list-inline-item page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className='ebs-prev-next'
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
