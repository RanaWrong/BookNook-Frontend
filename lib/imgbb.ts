export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey || apiKey === "your_imgbb_api_key_here" || apiKey === "test_imgbb_api_key") {
    // If no valid ImgBB API key is provided, convert file to base64 Data URL or simulate upload
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.error?.message || "Image upload to ImgBB failed.");
  }

  return data.data.display_url || data.data.url;
}
