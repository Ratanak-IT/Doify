interface TextCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function TextCard({ title, description, children, action }: TextCardProps) {
  return (
    <div className="bg-white border border-[#ebecf0] rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-[#172b4d]">{title}</h3>
          {description && <p className="text-sm text-[#6b778c] mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
