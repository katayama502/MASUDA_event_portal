/** Pexels直リンクのベースURL（IDのみ）から、指定幅にリサイズされた配信用URLを組み立てる */
export function pexelsPhoto(id: number, width: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}
