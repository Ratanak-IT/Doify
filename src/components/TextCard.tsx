interface TextCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function TextCard({ title, description, children, action }: TextCardProps) {
  return (
    <div className="bg-white border border-[#E8E8EF] rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1E293B]">{title}</h3>
          {description && <p className="text-sm text-[#94A3B8] mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
