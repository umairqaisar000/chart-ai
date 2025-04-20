"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

export const HoverCard = ({
    children,
    className = "",
    glareSize = 400
}: {
    children: React.ReactNode;
    className?: string;
    glareSize?: number;
}) => {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const { left, top, width, height } = card.getBoundingClientRect();

        // Calculate rotation based on mouse position
        const x = (e.clientX - left - width / 2) / 25;
        const y = -(e.clientY - top - height / 2) / 25;
        setRotate({ x: y, y: x });

        // Calculate glare position
        const glareX = ((e.clientX - left) / width) * 100;
        const glareY = ((e.clientY - top) / height) * 100;
        setGlarePosition({ x: glareX, y: glareY });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotate({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={cardRef}
            className={`relative overflow-hidden rounded-xl ${className}`}
            style={{
                transformStyle: "preserve-3d",
            }}
            animate={{
                rotateX: rotate.x,
                rotateY: rotate.y,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {/* Glare effect */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-0"
                animate={{
                    opacity: isHovered ? 0.4 : 0,
                    background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.7) 0%, transparent ${glareSize}px)`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
        </motion.div>
    );
}; 