import { motion } from 'framer-motion'

const pulse = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
  }
}

export const MovieCardSkeleton = () => (
  <motion.div variants={pulse} animate="animate" className="movie-card !bg-gray-700/20">
    <div className="rounded-lg h-auto w-full aspect-[2/3] bg-gray-600/30" />
    <div className="mt-4 space-y-2">
      <div className="h-4 rounded bg-gray-600/30 w-3/4" />
      <div className="flex flex-row items-center gap-2 mt-2">
        <div className="h-3 w-12 rounded bg-gray-600/30" />
        <div className="h-3 w-3 bg-gray-600/30" />
        <div className="h-3 w-8 rounded bg-gray-600/30" />
        <div className="h-3 w-3 bg-gray-600/30" />
        <div className="h-3 w-10 rounded bg-gray-600/30" />
      </div>
    </div>
  </motion.div>
)

export const TrendingSkeleton = () => (
  <motion.div
    variants={pulse}
    animate="animate"
    className="flex flex-row overflow-y-auto gap-5 w-full hide-scrollbar mt-10"
    style={{ minHeight: 163 }}
  >
    {[...Array(6)].map((_, i) => (
      <div key={i} className="min-w-[230px] flex flex-row items-center">
        <div className="w-[190px] h-[163px] fancy-text text-transparent bg-gray-600/20 rounded-lg" />
        <div className="w-[127px] h-[163px] rounded-lg -ml-[142px] bg-gray-600/30" />
      </div>
    ))}
  </motion.div>
)

export const MovieDetailSkeleton = () => (
  <div className="wrapper">
    <motion.div variants={pulse} animate="animate" className="h-4 w-32 rounded bg-gray-600/30 mb-6" />
    <motion.div variants={pulse} animate="animate" className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden mb-8 bg-gray-600/30" />
    <div className="flex flex-col sm:flex-row gap-8 mb-12">
      <motion.div variants={pulse} animate="animate" className="shrink-0 w-[250px] h-[375px] rounded-xl bg-gray-600/30" />
      <div className="flex flex-col gap-4 flex-1">
        <motion.div variants={pulse} animate="animate" className="h-10 w-3/4 rounded bg-gray-600/30" />
        <motion.div variants={pulse} animate="animate" className="h-5 w-1/2 rounded bg-gray-600/30" />
        <div className="flex gap-3">
          <motion.div variants={pulse} animate="animate" className="h-6 w-16 rounded-full bg-gray-600/30" />
          <motion.div variants={pulse} animate="animate" className="h-6 w-20 rounded bg-gray-600/30" />
        </div>
        <div className="flex gap-2">
          <motion.div variants={pulse} animate="animate" className="h-6 w-16 rounded-full bg-gray-600/30" />
          <motion.div variants={pulse} animate="animate" className="h-6 w-20 rounded-full bg-gray-600/30" />
          <motion.div variants={pulse} animate="animate" className="h-6 w-24 rounded-full bg-gray-600/30" />
        </div>
        <div className="space-y-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} variants={pulse} animate="animate" className="h-4 rounded bg-gray-600/30 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
)
