"use client";

export default function UserAvatar({ user, size = 40 }) {
  const letter = (user?.displayName || user?.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden bg-natural-sky-blue flex items-center justify-center"
    >
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName || "User avatar"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-white font-medium text-xl">{letter}</span>
      )}
    </div>
  );
}
