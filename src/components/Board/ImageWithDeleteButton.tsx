interface ImageWithDeleteButtonProps {
  src: string;
  alt: string;
  onDelete: () => void;
}

function ImageWithDeleteButton({ src, alt, onDelete }: ImageWithDeleteButtonProps) {
  return (
    <div className="relative inline-block">
      <img src={src} alt={alt} className="w-40 h-40 object-cover rounded mr-4" />
      <button
        onClick={onDelete}
        className="absolute -top-1 right-3 bg-red-500 text-white rounded-full p-1 m-1 text-xs hover:block"
      >
        X
      </button>
    </div>
  );
}

export default ImageWithDeleteButton
