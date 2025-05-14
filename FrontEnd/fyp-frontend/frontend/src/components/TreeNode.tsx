import React, { useState } from 'react';

interface TreeNode {
    name: string;
    type: 'folder' | 'file';
    path?: string;
    children?: TreeNode[];
    isOpen?: boolean;
}

interface TreeNodeComponentProps {
    node: TreeNode;
    handleFileSelect: (fileName: string) => void;
    selectedFile: string;
    toggleFolder: (node: TreeNode) => void;
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({ node, handleFileSelect, selectedFile, toggleFolder }) => {
    const [isOpen, setIsOpen] = useState<boolean>(node.isOpen || false);

    const handleClick = () => {
        if (node.type === 'file') {
            handleFileSelect(node.name);
        } else if (node.type === 'folder') {
            toggleFolder(node);
            setIsOpen(!isOpen);
        }
    };

    const renderIcon = (type: 'folder' | 'file', isOpen: boolean) => {
        if (type === 'folder') {
            return isOpen ? (
                <svg className="w-3 h-3 text-gray-800 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
                </svg>
            ) : (
                <svg className="w-3 h-3 text-gray-800 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
                </svg>
            );
        } else {
            return (
                <svg className="w-3 h-3 text-gray-800 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
                </svg>
            );
        }
    };
    
    return (
        <li className="text-black dark:text-white cursor-pointer">
            <span 
                className={`flex items-center justify-start pl-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    selectedFile === node.name ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`} 
                onClick={handleClick}
            >
                {renderIcon(node.type, isOpen)}
                <span>{node.name}</span>
            </span>
            {isOpen && node.children && (
                <ul className="ml-4">
                    {node.children.map((child, index) => (
                        <TreeNodeComponent
                            key={index}
                            node={child}
                            handleFileSelect={handleFileSelect}
                            selectedFile={selectedFile}
                            toggleFolder={toggleFolder}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default TreeNodeComponent;