type DirNode = {
  name: string;
  children: DirNode[];
};

type DirTree = DirNode[];

export { DirTree };
