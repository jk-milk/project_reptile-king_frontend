type DotsProps = {
  numberOfPages: number,
  currentPage: number,
  movePageTo: (index: number) => void
}

const Dots = ({ numberOfPages, currentPage, movePageTo }: DotsProps) => {
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30">
      {[...Array(numberOfPages)].map((_, index) => (
        <div
          key={index}
          className={`w-5 h-5 rounded-full ${index === currentPage ? 'bg-black' : 'bg-white'} my-4 cursor-pointer`}
          onClick={() => movePageTo(index)}
        />
      ))}
    </div>
  );
};

export default Dots;
