type PageHeaderProps = {
  title: string;
  description?: string;
  /** A button or link on the right, such as "Add address". */
  action?: React.ReactNode;
};

/** The page title (h1) with an optional line of explanation and an action. */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-600 md:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}
