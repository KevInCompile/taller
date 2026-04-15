import { BellDot, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface HeaderProps {
  children: React.ReactNode;
  title: string
  textButton: string
  actionButton: () => void
  iconButton: React.ReactNode
}

export const Header = (props: HeaderProps) => {
  const { title, textButton, actionButton, iconButton, children } = props;
  const { dark, toggle } = useTheme();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {title}
        </h1>
        {children}
      </div>
      <div className='flex items-center gap-4'>
        <button
          onClick={toggle}
        >
          {dark ? <Moon /> : <Sun />}
        </button>
        <button className='bg-foreground p-2 rounded-md'>
          <BellDot className='text-elements' size={20}/>
        </button>
        <button
          onClick={actionButton}
          className="self-start sm:self-auto bg-brand-accent text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-colors font-semibold text-sm"
        >
          {iconButton}
          {textButton}
        </button>
      </div>
    </header>
  )
};
