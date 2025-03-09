<template>
	<div class="row justify-content-center p-0 m-0" v-if="!currentNote">
		<!--COLLAPSIBLE FOLDER LIST-->
		<div class="row border-bottom">
			<div class="col text-start">
				<h2 class="mt-5">Folder List</h2>
			</div>

			<div class="col text-end">

			</div>
		</div>

		<div class="accordion accordion-flush border-0">
			<div
				class="accordion-item bg-transparent border-0"
			>
				<h2 class="accordion-header">
					<button
						type="button"
						class="accordion-button collapsed fs-5 border-bottom"
						data-bs-toggle="collapse"
						data-bs-target="#add_folder_form"
						v-on:click="toggleFolderForm()"
					>
						<i
							:class="folderFormInProgress ? 'bi bi-x-lg' : 'bi bi-folder-plus'"
						></i>
						<span class="ms-2">{{
							folderFormInProgress ? "Cancel" : "Add New Folder"
						}}</span>
					</button>
				</h2>

				<div class="collapse p-0 m-0" id="add_folder_form">
					<div class="card card-body sharp-top-border border-top-0 mb-2">
						<form @submit.prevent="addFolder">
							<div class="row mb-2">
								<div class="col-6">
									<small>Folder Name</small>
									<input
										type="text"
										class="form-control"
										placeholder="e.g. COMP 4350"
										v-model="folderData.name"
										required
									/>
								</div>

								<div class="col-4">
									<small>Priority</small>
									<select
										class="form-select"
										v-model="folderData.priority"
										required
									>
										<option value selected disabled>Select</option>
										<option :value="true">Major Requirement</option>
										<option :value="false">Elective</option>
									</select>
								</div>

								<div class="col-2 mt-auto">
									<button type="submit" class="btn btn-primary w-100 align-self-bottom">
										Add
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div
				class="accordion-item bg-transparent border-0"
				v-for="folder in folderList"
				:key="folder._id"
			>
				<h2 class="accordion-header">
					<button
						type="button"
						class="accordion-button collapsed fs-5 border-bottom"
						data-bs-toggle="collapse"
						:data-bs-target="'#folderID' + folder._id + 'dashboard'"
					>
						<span class="text-truncate">{{ folder.name }}</span>
					</button>
				</h2>

				<!--NOTES LIST FOR EACH FOLDER-->
				<div
					:id="'folderID' + folder._id + 'dashboard'"
					class="accordion-collapse collapse"
				>
					<div class="accordion-body bg-transparent pt-0 pb-0 ps-3 pe-0 fs-6 mb-2">
						<div class="list-group sharp-top-border">
							<!--ADD NOTE FORM TRIGGER-->
							<button
								type="button"
								class="list-group-item list-group-item-action ps-3 py-2 border-top-0"
								data-bs-toggle="modal"
								data-bs-target="#add_edit_note_form"
								v-on:click="passCurrentFolder(folder)"
							>
								<i class="bi bi-plus-lg me-1"></i> Create new note
							</button>

							<div
								class="list-group-item list-group-item-action px-3 py-2"
								v-for="note in folder.notes"
								v-bind:key="note._id"
								v-on:click="openNotes(folder, note)"
							>
								<div class="row p-0">
									<div class="col-6 text-start text-truncate">
										<span class="align-middle">{{ note.title }}</span>
									</div>

									<div class="col-6 text-start text-truncate text-end">
										<span class="align-middle" v-if="note.createdAt === note.updatedAt">Created {{ new Date(note.createdAt).toLocaleString() }}</span>
										<span class="align-middle" v-else>Last updated {{ new Date(note.createdAt).toLocaleString() }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>

</script>


<style>

</style>