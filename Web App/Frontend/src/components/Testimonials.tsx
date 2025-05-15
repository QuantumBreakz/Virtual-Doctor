import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
    {
        content: 'The Virtual Doctor platform has completely changed the way I manage my health. The real-time monitoring feature is a lifesaver!',
        name: 'John D.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
        rating: 5
    },
    {
        content: 'I love the detailed medicine descriptions. It helps me stay informed and confident about my treatment.',
        name: 'Sophia R.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
        rating: 4
    },
    {
        content: 'Finally, a platform that cares about my mental and physical health. It\'s like having a personal health assistant!',
        name: 'Rajiv P.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
        rating: 5
    },
    {
        content: 'The AI diagnostics are incredibly accurate. It detected my condition early, and I got treatment right away.',
        name: 'Emma J.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        rating: 5
    }
];

const Testimonials = () => {
    const swiperRef = useRef<SwiperType>();

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Hear What Our Users Have to Say
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto" />
                </motion.div>

                <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                    pagination={{ clickable: true }}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    className="pb-12"
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl h-full"
                            >
                                <div className="flex items-center mb-6">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </h3>
                                        <div className="flex mt-1">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-4 h-4 text-yellow-400 fill-current"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 italic">
                                    "{testimonial.content}"
                                </p>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="flex justify-center gap-4 mt-8">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => swiperRef.current?.slideNext()}
                        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;